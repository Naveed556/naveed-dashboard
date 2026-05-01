#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { username } from "better-auth/plugins";
import { dash } from "@better-auth/infra";

function loadDotEnv(filePath: string) {
    if (!existsSync(filePath)) return;

    const contents = readFileSync(filePath, "utf8");
    const lines = contents.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const [key, ...rest] = trimmed.split("=");
        if (!key) continue;

        const value = rest.join("=").trim();
        if (process.env[key] === undefined) {
            process.env[key] = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
        }
    }
}

async function main() {
    loadDotEnv(resolve(process.cwd(), ".env.local"));

    const [, , email, password, usernameArg, fullName = "Admin User"] = process.argv;

    if (!email || !password || !usernameArg) {
        console.error("Usage: npm run create-admin -- <email> <password> <username> [fullName]");
        process.exit(1);
    }

    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/new-dashboard";
    console.log("Connecting to MongoDB at:", uri);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        const auth = betterAuth({
            user: {
                modelName: "user",
                additionalFields: {
                    gender: { type: "string", defaultValue: "male", required: true },
                    commission: { type: "number", defaultValue: 0, required: true },
                    accessibleSites: { type: "string[]", defaultValue: [], required: true },
                },
            },
            database: mongodbAdapter(db),
            emailAndPassword: { enabled: true },
            plugins: [
                admin(),
                dash(),
                username({
                    usernameValidator: (username) => {
                        if (username === "admin") {
                            return false;
                        }
                        return true;
                    },
                    usernameNormalization: (username) => {
                        return username.toLowerCase()
                            .replaceAll("0", "o")
                            .replaceAll("3", "e")
                            .replaceAll("4", "a");
                    }
                }),
            ],
        });

        const usernameNormalized = usernameArg.toLowerCase();
        console.log("Creating admin user:", email, "username:", usernameNormalized);

        await auth.api.createUser({
            body: {
                name: fullName,
                email,
                password,
                role: "admin",
                data: {
                    emailVerified: true,
                    username: usernameNormalized,
                    gender: "male",
                    image: "/male_profile.png",
                    commission: 0,
                    accessibleSites: [],
                },
            },
        });

        console.log("Admin user created successfully.");
    } catch (error) {
        console.error("Failed to create admin user:", error instanceof Error ? error.message : error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main();
