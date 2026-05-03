import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";
import clientPromise from "./mongodb";
import { sendEmail } from "./email";

const client = await clientPromise;
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
