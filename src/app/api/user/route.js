import { NextResponse } from "next/server";
import db from "@/app/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  const querySnapshot = await getDocs(collection(db, "user"));
  const user = [];
  querySnapshot.forEach((doc) => {
    user.push(doc.data());
  });
  return NextResponse.json(user);
}
