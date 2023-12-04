import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/prisma/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session }) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (user) {
        session.user = { ...session.user, id: user.id };
      }
      return session;
    },
    async signIn({ profile, user }) {
      const userExists = await prisma.user.findUnique({
        where: {
          email: profile?.email,
        },
      });

      if (!userExists) {
        await prisma.user.create({
          data: {
            email: profile?.email || "",
            name: profile?.name || "",
            image: profile?.image || "",
          },
        });
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
