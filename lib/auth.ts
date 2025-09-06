import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export interface BackendFields {
  backendAccessToken?: string;
  backendRole?: string;
  backendUserId?: number;
}

interface BackendUser extends BackendFields {
  id: string;
  email?: string;
  name?: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<BackendUser | null> {
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
        } as BackendUser;
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
        const { email, name, picture } = profile as { email?: string; name?: string; picture?: string };
        const [firstName = "", lastName = ""] = (name || "").split(" ");
        const photoUrl = picture;
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
          (token as BackendFields).backendAccessToken = data.accessToken;
          (token as BackendFields).backendRole = data.user?.role;
          (token as BackendFields).backendUserId = data.user?.id;
        } else {
          throw new Error("OAuth backend failed");
        }
      } else if (account?.provider === 'credentials' && user) {
        (token as BackendFields).backendAccessToken = (user as BackendFields).backendAccessToken;
        (token as BackendFields).backendRole = (user as BackendFields).backendRole;
        (token as BackendFields).backendUserId = (user as BackendFields).backendUserId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as BackendFields).backendAccessToken = (token as BackendFields).backendAccessToken;
        (session as BackendFields).backendRole = (token as BackendFields).backendRole;
        (session as BackendFields).backendUserId = (token as BackendFields).backendUserId;
      }
      return session;
    },
  },
};

