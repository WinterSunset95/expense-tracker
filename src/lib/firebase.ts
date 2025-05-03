// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAKgw2wBBhvaBXBpiB_4-rDWDon1JTDr2c",
	authDomain: "winter-f3cb5.firebaseapp.com",
	projectId: "winter-f3cb5",
	storageBucket: "winter-f3cb5.firebasestorage.app",
	messagingSenderId: "548025054656",
	appId: "1:548025054656:web:2b83c531c8a552c358c425",
	measurementId: "G-Q4VVGBFGPW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
getAuth(app).tenantId = "expense-tracker";
const storage = getStorage(app);
if (process.env.NODE_ENV === "development") {
        connectAuthEmulator(getAuth(app), "http://localhost:9099");
        connectFirestoreEmulator(getFirestore(app), "localhost", 8080);
        //const functions = getFunctions(getApp());
        //connectFunctionsEmulator(functions, "localhost", 5001);
        //connectStorageEmulator(storage, "localhost", 9199);
}
//export const analytics = getAnalytics(app);

