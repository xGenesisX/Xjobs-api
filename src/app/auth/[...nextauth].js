import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from "uuid";
import db from "../utils/db"
import { SigninMessage } from "../utils/signMessage"
import { getUserProfileWithAddress } from "../controllers/profile.controller.ts"

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  //adding user info to the user session object
  callbacks: {
    async session({ token, session, user }) {
      await db();
      session.user = token.user;
      if (user?.role) session.user.role = user.role;
      const bannedChecker = await getUserProfileWithAddress({
        userAddress: session.user.address,
      });

      if (bannedChecker && bannedChecker.banned) {
        return {};
      }

      return session;
    },
    async jwt({ token, user }) {
      user && (token.user = user);
      if (user?.role) token.role = user.role;
      return token;
    },
  },

  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        role: {
          label: "Role",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        await db();
        try {
          const { message, signature, role } = credentials;
          const signinMessage = new SigninMessage(JSON.parse(message || "{}"));

          const validationResult = await signinMessage.validate(
            signature || ""
          );

          if (!validationResult) {
            throw new Error("Could not validate the signed message");
          }

          const user = {
            address: signinMessage.publicKey,
            profileId: uuidv4().toString(),
            signature,
            role,
          };

          return user;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
});