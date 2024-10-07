// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/config/firebaseConfig";

const authOptions = {
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
        const usersRef = collection(db, "user");
        const q = query(usersRef, where("email", "==", credentials.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("User not found");
        }

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();

        if (user.password !== credentials.password) {
          throw new Error("Invalid email or password");
        }

        return {
          id: userDoc.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
