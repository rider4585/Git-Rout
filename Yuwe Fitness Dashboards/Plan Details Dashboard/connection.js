import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

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
const exerciseData = ref(database, 'exercise-name');

function readData() {

    return new Promise((resolve, reject) => {
        onValue(exerciseData, function (snapshot) {
            const data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error.message);
        });
    });
}

//   push(dataToPush, testData);
// onValue(exerciseData, function (snapshot) {
//     const data = snapshot.val();
//     console.log(data);
// })

readData().then(function(data){
    console.log(data);
}).catch(function(error){
    console.error(error);
})

export { readData }