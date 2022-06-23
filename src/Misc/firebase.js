import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCeq81rApxH9VFkyHWD40TsPGMAqmrz-tQ",
    authDomain: "chat-application-957c9.firebaseapp.com",
    databaseURL: "https://chat-application-957c9-default-rtdb.firebaseio.com",
    projectId: "chat-application-957c9",
    storageBucket: "chat-application-957c9.appspot.com",
    messagingSenderId: "644974979814",
    appId: "1:644974979814:web:78c488c1f93dde9f66e927"
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const database = app.database();