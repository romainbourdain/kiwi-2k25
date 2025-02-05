import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      return token;
    },

    session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;

      return session;
    },
  },
};
