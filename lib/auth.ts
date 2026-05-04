import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";
import clientPromise from "./mongodb";
import { sendEmail } from "./email";
import { APIError } from "@better-auth/core/error";
import {
  normalizeUsernameForAuth,
  RESERVED_ADMIN_USERNAME,
} from "@/lib/username";
import { reservedAdminUsernamePlugin } from "@/lib/reserved-username-plugin";

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const u = user as Record<string, unknown>;
          const raw = u.username;
          const role = String(u.role ?? "user");
          if (typeof raw === "string") {
            if (
              normalizeUsernameForAuth(raw) === RESERVED_ADMIN_USERNAME &&
              role !== "admin"
            ) {
              throw APIError.from("BAD_REQUEST", {
                code: "RESERVED_USERNAME",
                message: "This username is reserved for administrators.",
              });
            }
          }
          return { data: user };
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
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
    { client, }
  ),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Block sign-in if not verified
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${url}">${url}</a>
       `,
      });
    },
    onPasswordReset: async ({ user }) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
        <h2>Email Verification</h2>
        <p>Click below to verify:</p>
        <a href="${url}">${url}</a>
      `,
      });
    },
    sendOnSignIn: true, // Resend verification email on sign-in attempt
  },
  plugins: [
    admin(),
    dash(),
    username({
      usernameNormalization: (u) => normalizeUsernameForAuth(u),
    }),
    reservedAdminUsernamePlugin(),
    nextCookies(),
  ],
});
