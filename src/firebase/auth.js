import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const auth = getAuth();

export const signUp = async (email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", userCredential.user.uid), { role, email });

    return user;
  };

export const logIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

export const logOut = async () => {
    await signOut(auth);
};
