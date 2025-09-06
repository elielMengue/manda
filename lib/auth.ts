import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await fetch(`${apiBase}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
          id: String(data.user?.id ?? ''),
          email: data.user?.email,
          name: `${data.user?.firstName ?? ''} ${data.user?.lastName ?? ''}`.trim(),
          backendAccessToken: data.accessToken,
          backendRole: data.user?.role,
          backendUserId: data.user?.id,
        } as any;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account?.provider === 'google' && profile) {
        const email = (profile as any).email as string;
        const name = (profile as any).name as string | undefined;
        const [firstName = "", lastName = ""] = (name || "").split(" ");
        const photoUrl = (profile as any).picture as string | undefined;
        const res = await fetch(`${apiBase}/api/v1/auth/oauth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            email,
            firstName,
            lastName,
            photoUrl,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          (token as any).backendAccessToken = data.accessToken;
          (token as any).backendRole = data.user?.role;
          (token as any).backendUserId = data.user?.id;
        } else {
          throw new Error("OAuth backend failed");
        }
      } else if (account?.provider === 'credentials' && user) {
        (token as any).backendAccessToken = (user as any).backendAccessToken;
        (token as any).backendRole = (user as any).backendRole;
        (token as any).backendUserId = (user as any).backendUserId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).backendAccessToken = (token as any).backendAccessToken;
        (session as any).backendRole = (token as any).backendRole;
        (session as any).backendUserId = (token as any).backendUserId;
      }
      return session;
    },
  },
};

