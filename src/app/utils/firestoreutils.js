import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
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

export const getHistoryLaporanUser = async (email) => {
  try {
    const laporanRef = collection(db, "laporan");

    const q = query(laporanRef, where("email", "==", email));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    const laporanData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return laporanData;
  } catch (error) {
    console.error("Error fetching laporan data: ", error);
    throw new Error(error.message);
  }
};

export const getLaporan = async () => {
  try {
    const laporanRef = collection(db, "laporan");
    const snapshot = await getDocs(laporanRef);
    const laporanData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return laporanData;
  } catch (error) {
    console.error("Error fetching laporan data: ", error);
    throw new Error(error.message);
  }
};

export const getUser = async () => {
  try {
    const userRef = collection(db, "user");
    const snapshot = await getDocs(userRef);
    const userData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return userData;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw new Error(error.message);
  }
};

export const register = async ({ name, email, password, role }) => {
  try {
    const userRef = collection(db, "user");
    const user = {
      name,
      email,
      password,
      role,
    };
    const docRef = await addDoc(userRef, user);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error(error.message);
  }
};
