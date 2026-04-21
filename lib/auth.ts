import { betterAuth, string } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";

const client = new MongoClient(
  (process.env.MONGODB_URI as string) ||
  "mongodb://localhost:27017/new-dashboard",
);
const db = client.db();

export const auth = betterAuth({
  user: {
    modelName: "user",
    additionalFields: {
      gender: {
        type: "string",
        defaultValue: "male",
        required: true,
      },
      commission: {
        type: "number",
        defaultValue: 0,
        required: true,
      },
      accessibleSites: {
        type: "string[]",
        defaultValue: [],
        required: true,
      },
    },
  },
  database: mongodbAdapter(
    db,
    // {client,}
  ),
  emailAndPassword: {
    enabled: true,
  },
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
    nextCookies(),
  ],
});
