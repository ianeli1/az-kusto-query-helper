import NextAuth from "next-auth";
import { signIn } from "next-auth/client";
import Providers from "next-auth/providers";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.AzureADB2C({
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      scope: "offline_access User.Read",
      tenantId: process.env.AZURE_TENANT_ID,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(user, account, metadata) {
      const githubUser = {
        id: metadata.id,
        login: metadata.login,
        name: metadata.name,
        avatar: user.image,
      };

      user.accessToken = account.accessToken;
      return true;
    },
    async jwt(token, user) {
      if (user) {
        token = { accessToken: user.accessToken };
      }

      return token;
    },
    async session(session, token) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
