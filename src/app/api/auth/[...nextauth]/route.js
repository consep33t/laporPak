import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query, where, collection, getDocs } from "firebase/firestore";
import db from "@/app/config/firebaseConfig";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          console.log("CREDENTIALS: ", { email, password });

          const q = query(collection(db, "user"), where("email", "==", email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const user = userDoc.data();
            console.log("USER FOUND: ", user);

            if (user.password === password) {
              return {
                id: userDoc.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            } else {
              throw new Error("Invalid password");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (error) {
          console.error("ERROR: ", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
