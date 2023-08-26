import {
    app,
    database,
    ref,
    onValue,
    update,
    remove
} from "./firebase_setup.js";

const exerciseDataDB = ref(database, 'development/exercise_name');
let exerciseData = {};
const form = document.querySelector('#exercise-form');
const dataToAppendDiv = document.querySelector('.dataToAppend');

onValue(exerciseDataDB, function (snapshot) {
    const data = snapshot.val();
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

    const formData = {
        exerciseName: document.querySelector('#exercise-name').value,
        bodyPart: document.querySelector('#body-part').value,
        muscleInvolved: document.querySelector('#muscle-involved').value,
        jointInvolved: document.querySelector('#joint-involved').value,
        exerciseType: document.querySelector('#exercise-type').value,
        equipmentUsed: document.querySelector('#equipment-used').value,
        workoutSplits: document.querySelector('#workout-splits').value,
        location: document.querySelector('#location').value,
        formAndTechnique: document.querySelector('#form-and-technique').value,
        imagesLink: document.querySelector('#images-link').value,
        gifLink: document.querySelector('#gif-link').value,
        videoLink: document.querySelector('#video-link').value,
        benefits: document.querySelector('#benefits').value,
        // keywords: document.querySelector('#keywords').value,
    };

    exerciseData[formData.exerciseName.toUpperCase()] = {
        'Body Part': formData.bodyPart,
        'Muscle Involved': formData.muscleInvolved,
        'Joint Involved': formData.jointInvolved,
        'Type of Exercise': formData.exerciseType,
        'Equipment Used': formData.equipmentUsed,
        'Workout Splits': formData.workoutSplits,
        'Location': formData.location,
        'Form and Technique': formData.formAndTechnique,
        'Images Link': formData.imagesLink.split(',').map(link => link.trim()),
        'GIF Link': formData.gifLink.split(',').map(link => link.trim()),
        'Video Link': formData.videoLink,
        'Benefits': formData.benefits,
        'Keywords': generateKeywords(formData),
    };

    form.reset();
    createDetailsView(exerciseData);
    update(exerciseDataDB, {
        [formData.exerciseName]: exerciseData[formData.exerciseName],
    });
});

function createDetailsView(exerciseData) {
    let innerHtmlToAppend = "";

    for (const exerciseNameField in exerciseData) {
        const exerciseDetails = exerciseData[exerciseNameField];
        const buttonsHtml = `
            <button type="submit" class="btn btn-primary btn-right" data-item="${exerciseNameField}_edit">Edit</button>
            <button type="submit" class="btn btn-danger btn-right" data-item="${exerciseNameField}_delete">Delete</button>
        `;

        const tempData = `
            <details id="${exerciseNameField}">
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
                        ${buttonsHtml}
                    </div>
                </div>
            </details>`;

        innerHtmlToAppend += tempData;
    }

    dataToAppendDiv.innerHTML = innerHtmlToAppend;
    eventListenersToButtons();
}

function eventListenersToButtons() {
    const allBtn = document.querySelectorAll(".btn-right");
    for (const element of allBtn) {
        element.addEventListener('click', function (e) {
            const btnData = e.target.getAttribute('data-item');
            if (btnData.includes('_edit')) {
                const exerciseName = btnData.replace("_edit", "");
                editDetails({
                    [exerciseName]: exerciseData[exerciseName]
                });
            } else {
                const exerciseName = btnData.replace("_delete", "");
                deleteRecord(exerciseName);
            }
        });
    }
}

function deleteRecord(exerciseName) {
    const dataToDeleteFromDB = ref(database, `development/exercise_name/${exerciseName}`);
    if (confirm(`Do you really want to delete data of ${exerciseName}`)) {
        remove(dataToDeleteFromDB)
            .then(function () {
                alert(`Data for ${exerciseName} deleted successfully!`);
                createDetailsView(exerciseData);
                location.reload();
            })
            .catch(error => alert(error));
    }
}

function generateKeywords(data) {
    const {
        exerciseName,
        bodyPart,
        muscleInvolved,
        jointInvolved,
        exerciseType,
        equipmentUsed,
        workoutSplits,
        location,
        formAndTechnique,
        benefits,
    } = data;

    const values = [
        exerciseName,
        bodyPart,
        muscleInvolved,
        jointInvolved,
        exerciseType,
        equipmentUsed,
        workoutSplits,
        location,
        formAndTechnique,
        benefits,
    ];

    const concatenatedKeywords = values
        .filter(value => value !== "") // Exclude empty strings
        .join(', ');

    return concatenatedKeywords;
}