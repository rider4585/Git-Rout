import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

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
const exerciseDataDB = ref(database, 'exercise_name');

var exerciseData = {};
const form = document.querySelector('#exercise-form');
const dataToAppendDiv = document.querySelector('.dataToAppend');

onValue(exerciseDataDB, function (snapshot) {
    const data = snapshot.val();
    console.log(data);
    if (data !== null && Object.keys(data).length !== 0) {
        exerciseData = data;
        if (Object.keys(exerciseData).length !== 0) {
            createDetailsView(exerciseData);
        }
    }
}, (error) => {
    alert(error.message);
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const exerciseName = document.querySelector('#exercise-name').value;
    const bodyPart = document.querySelector('#body-part').value;
    const muscleInvolved = document.querySelector('#muscle-involved').value;
    const jointInvolved = document.querySelector('#joint-involved').value;
    const exerciseType = document.querySelector('#exercise-type').value;
    const equipmentUsed = document.querySelector('#equipment-used').value;
    const workoutSplits = document.querySelector('#workout-splits').value;
    const location = document.querySelector('#location').value;
    const formAndTechnique = document.querySelector('#form-and-technique').value;
    const imagesLink = document.querySelector('#images-link').value;
    const gifLink = document.querySelector('#gif-link').value;
    const videoLink = document.querySelector('#video-link').value;
    const benefits = document.querySelector('#benefits').value;
    const keywords = document.querySelector('#keywords').value;

    exerciseData[exerciseName] = {
        'Body Part': bodyPart,
        'Muscle Involved': muscleInvolved,
        'Joint Involved': jointInvolved,
        'Type of Exercise': exerciseType,
        'Equipment Used': equipmentUsed,
        'Workout Splits': workoutSplits,
        'Location': location,
        'Form and Technique': formAndTechnique,
        'Images Link': imagesLink.split(',').map(link => link.trim()),
        'GIF Link': gifLink.split(',').map(link => link.trim()),
        'Video Link': videoLink,
        'Benefits': benefits,
        'Keywords': keywords
    };

    form.reset();
    createDetailsView(exerciseData);
    update(exerciseDataDB, {
        [exerciseName]: exerciseData[exerciseName]
    });
});

function createDetailsView(exerciseData) {
    let innerHtmlToAppend = "";
    let tempData = "";
    let exerciseName = "";
    for (const exerciseNameField in exerciseData) {
        tempData = '';
        exerciseName = exerciseNameField;
        for (const exerciseDataField in exerciseData[exerciseNameField]) {
            tempData = `
            <details id='${exerciseNameField}'>
                <summary class="btn-success">${exerciseNameField}</summary>
                <div class="container-fluid summery-data">
                    <div class="row">
                    <div class="col-md-4"><strong>Body Part:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Body Part']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Muscle Involved:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Muscle Involved']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Joint Involved:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Joint Involved']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Type of Exercise:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Type of Exercise']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Equipment Used:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Equipment Used']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Workout Splits:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Workout Splits']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Location:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Location']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Form and Technique:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Form and Technique']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Images Link:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Images Link']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>GIF Link:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['GIF Link']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Video Link:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Video Link']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Benefits:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['Benefits']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Keywords:</strong></div>
                    <div class="col-md-8">${exerciseData[exerciseNameField]['keywords']}</div>
                    </div>
                    <div class="row">
                    <button type="submit" class="btn btn-primary btn-right" data-item="${exerciseName}_edit">Edit</button>
                    </div>
                    <div class="row">
                    <button type="submit" class="btn btn-danger btn-right" data-item="${exerciseName}_delete">Delete</button>
                    </div>
                </div>
            </details>`;

        }

        innerHtmlToAppend += tempData;
    }
    dataToAppendDiv.innerHTML = innerHtmlToAppend;
    eventListenersToButtons();
}

function eventListenersToButtons() {
    let allBtn = document.querySelectorAll(".btn-right");
    for (let i = 0; i < allBtn.length; i++) {
        allBtn[i].addEventListener('click', function (e) {
            let btnData = e.target.getAttribute('data-item');
            if (btnData.includes('_edit')) {
                console.log("edit");
                let exerciseName = btnData.replace("_edit", "");
                console.log(exerciseName);
                editDetails({
                    [exerciseName]: exerciseData[exerciseName]
                });

            } else {
                console.log("delete");
                let exerciseName = btnData.replace("_delete", "");
                console.log(exerciseName);
                deleteRecord(exerciseName);
            }
        })
    }
}

function deleteRecord(exerciseName) {
    let dataToDeleteFromDB = ref(database, `exercise_name/${exerciseName}`);
    console.log({
        [exerciseName]: exerciseData[exerciseName]
    });
    if (confirm(`Do you really want to delete data of ${exerciseName}`)) {
        remove(dataToDeleteFromDB)
            .then(function () {
                alert(`Data for ${exerciseName} deleted successfully!`);
                createDetailsView(exerciseData);
                location.reload();
            })
            .catch(error => alert(error))
    }
}