import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const saveDataToFirestore = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "laporan"), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error(error.message);
  }
};
