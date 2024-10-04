// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import db from "@/app/config/firebaseConfig";

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
        // Query Firestore to find the user with the provided email and password
        const usersRef = collection(db, "user");
        const q = query(usersRef, where("email", "==", credentials.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("User not found");
        }

        // Extract user data from Firestore
        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();

        // Check if the provided password matches the stored password
        if (user.password !== credentials.password) {
          throw new Error("Invalid email or password");
        }

        // Return user data if authentication is successful
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
