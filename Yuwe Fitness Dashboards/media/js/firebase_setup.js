// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, push, set, get, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { getStorage, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAlkqBseMsKLwP4HsSqATHSry17PQqYNTg",
    authDomain: "yuwe-fitness.firebaseapp.com",
    databaseURL: "https://yuwe-fitness-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "yuwe-fitness",
    storageBucket: "yuwe-fitness.appspot.com",
    messagingSenderId: "411480626389",
    appId: "1:411480626389:web:accc7f74bb1568d3007e5c",
    measurementId: "G-V4G0LYXZX6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Function to upload an image to Firebase Storage
async function uploadImageToFirebase(file) {
    console.log("hi");
    const storageReference = ref(storage, 'images/' + file.name);
    await uploadBytes(storageReference, file);
  
    const downloadURL = await getDownloadURL(storageReference);
    return downloadURL;
  }

export { app, database, ref, storage, onValue, update, getDownloadURL, uploadBytes, remove, get, push, set, uploadImageToFirebase };

