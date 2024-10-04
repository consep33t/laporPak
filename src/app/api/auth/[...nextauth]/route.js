// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "@/app/config/firebaseConfig";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const q = query(
          collection(db, "users"),
          where("email", "==", credentials.email),
          where("password", "==", credentials.password)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const user = querySnapshot.docs[0].data();
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } else {
          throw new Error("Email or password is incorrect");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirect to login page on error
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
