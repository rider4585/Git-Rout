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
const planDetailsDB = ref(database, 'plan_details');

var planDetails = {};
const form = document.querySelector('#exercise-form');
const dataToAppendDiv = document.querySelector('.dataToAppend');

onValue(planDetailsDB, function (snapshot) {
    const data = snapshot.val();
    if (data !== null && Object.keys(data).length !== 0) {
        planDetails = data;
        if (Object.keys(planDetails).length !== 0) {
            createDetailsView(planDetails);
        }
    }
}, (error) => {
    alert(error.message);
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const planName = document.querySelector('#plan-name').value;
    const mode = document.querySelector('#mode').value;
    const duration = document.querySelector('#duration').value;
    const dietUpdate = document.querySelector('#diet-update').value;
    const counselling = document.querySelector('#counselling').value;
    const rates = document.querySelector('#rates').value;
    const offeredPrice = document.querySelector('#offered-price').value;
    const fullPayment = document.querySelector('#full-payment').value;

    planDetails[planName] = {
        'Mode': mode,
        'Duration': duration,
        'Diet Update': dietUpdate,
        'Counselling': counselling,
        'Rates': rates,
        'Offered Price': offeredPrice,
        'Full Payment': fullPayment
    };

    form.reset();
    createDetailsView(planDetails);
    update(planDetailsDB, {
        [planName]: planDetails[planName]
    });
});

function createDetailsView(planDetails) {
    let innerHtmlToAppend = "";
    let tempData = "";
    let planName = "";
    for (const plan in planDetails) {
        tempData = '';
        planName = plan;
        for (const exerciseDataField in planDetails[plan]) {
            tempData = `
            <details id='${plan}'>
                <summary class="btn-success">${plan}</summary>
                <div class="container-fluid summery-data">
                    <div class="row">
                    <div class="col-md-4"><strong>Mode:</strong></div>
                    <div class="col-md-8">${planDetails[plan]['Mode']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Duration:</strong></div>
                    <div class="col-md-8">${planDetails[plan]['Duration']} Weeks</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Diet Update:</strong></div>
                    <div class="col-md-8">${planDetails[plan]['Diet Update']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Counselling:</strong></div>
                    <div class="col-md-8">${planDetails[plan]['Counselling']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Rates:</strong></div>
                    <div class="col-md-8">${planDetails[plan]['Rates']}₹</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Offered Price:</strong></div>
                    <div class="col-md-8">${planDetails[plan]['Offered Price']}₹</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Full Payment:</strong></div>
                    <div class="col-md-8">${planDetails[plan]['Full Payment']}₹</div>
                    </div>
                    <div class="row edit-btn">
                    <button type="submit" class="btn btn-primary btn-right" data-item="${planName}_edit">Edit</button>
                    <button type="submit" class="btn btn-danger btn-right" data-item="${planName}_delete">Delete</button>
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
                let planName = btnData.replace("_edit", "");
                editDetails({
                    [planName]: planDetails[planName]
                });

            } else {
                let planName = btnData.replace("_delete", "");
                deleteRecord(planName);
            }
        })
    }
}

function deleteRecord(planName) {
    let dataToDeleteFromDB = ref(database, `plan_details/${planName}`);
    if (confirm(`Do you really want to delete data of ${planName}`)) {
        remove(dataToDeleteFromDB)
            .then(function () {
                alert(`Data for ${planName} deleted successfully!`);
                createDetailsView(planDetails);
                location.reload();
            })
            .catch(error => alert(error))
    }
}