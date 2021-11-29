import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import FortyTwoProvider from "next-auth/providers/42";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "../../../prisma/db";
const argon2 = require("argon2");

export default NextAuth({
  theme: {
    colorScheme: "light",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    /* FortyTwoProvider({
      clientId: process.env.FORTY_TWO_CLIENT_ID,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
    }), */
    {
      id: "42-school",
      name: "42 School",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: "https://api.intra.42.fr/oauth/authorize?response_type=code",
        params: { scope: "" },
      },
      token: "https://api.intra.42.fr/oauth/token",
      userinfo: "https://api.intra.42.fr/v2/me",
      profile(profile) {
        console.log(profile);
        return {
          id: profile.id,
          email: profile.email,
          image: profile.image_url,
          name: profile.usual_full_name,
          username: profile.login,
          firstName: profile.first_name,
          lastName: profile.last_name,
        };
      },
      clientId: process.env.FORTY_TWO_CLIENT_ID,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
    },
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    }),

    CredentialsProvider({
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
          });
          if (!user) {
            return null;
          }
          const valid = await argon2.verify(
            user.password,
            credentials.password
          );
          if (!valid) {
            return null;
          }
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),

    // ...add more providers here
  ],
  pages: {
    signIn: "../../signin",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      console.log("session", session);
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
  secret: process.env.AUTH_SECRET,
  session: {
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: "sdfsdfsdfsdf", //TODO: .env...
    encryption: true,
  },
});
