import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export const RegisterApi = (email, password) => {
  // returns a Promise<UserCredential>, throws FirebaseError on failure
  return createUserWithEmailAndPassword(auth, email, password);
};

export const LoginApi = (email, password) => {
  // same here
  return signInWithEmailAndPassword(auth, email, password);
};

export const getUser = () => auth.currentUser;

export const getLoggedOut = async () => {
  await signOut(auth);
  console.log("signout successfully");
};
