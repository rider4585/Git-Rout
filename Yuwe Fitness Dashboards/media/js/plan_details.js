import {
    app,
    database,
    ref,
    onValue,
    update,
    remove
} from "./firebase_setup.js";

const planDetailsDB = ref(database, 'development/plan_details');
let planDetails = {};
const form = document.querySelector('#exercise-form');
const dataToAppendDiv = document.querySelector('.dataToAppend');

onValue(planDetailsDB, function (snapshot) {
    const data = snapshot.val();
    if (data !== null && Object.keys(data).length !== 0) {
        planDetails = data;
        if (Object.keys(planDetails).length !== 0) {
            // console.log(planDetails);
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
    const innerHtmlToAppend = Object.keys(planDetails).map(planName => {
        const planData = planDetails[planName];
        return `
            <details id="${planName}">
                <summary class="btn-success">${planName}</summary>
                <div class="container-fluid summery-data">
                    <div class="row">
                    <div class="col-md-4"><strong>Mode:</strong></div>
                    <div class="col-md-8">${planData['Mode']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Duration:</strong></div>
                    <div class="col-md-8">${planData['Duration']} Weeks</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Diet Update:</strong></div>
                    <div class="col-md-8">${planData['Diet Update']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Counselling:</strong></div>
                    <div class="col-md-8">${planData['Counselling']}</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Rates:</strong></div>
                    <div class="col-md-8">${planData['Rates']}₹</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Offered Price:</strong></div>
                    <div class="col-md-8">${planData['Offered Price']}₹</div>
                    </div>
                    <div class="row">
                    <div class="col-md-4"><strong>Full Payment:</strong></div>
                    <div class="col-md-8">${planData['Full Payment']}₹</div>
                    </div>
                    <div class="row edit-btn">
                    <button type="submit" class="btn btn-primary btn-right" data-item="${planName}_edit">Edit</button>
                    <button type="submit" class="btn btn-danger btn-right" data-item="${planName}_delete">Delete</button>
                    </div>
                </div>
            </details>`;
    }).join('');

    dataToAppendDiv.innerHTML = innerHtmlToAppend;
    eventListenersToButtons();
}

function eventListenersToButtons() {
    const allBtn = document.querySelectorAll(".btn-right");
    allBtn.forEach(element => {
        element.addEventListener('click', function (e) {
            const btnData = e.target.getAttribute('data-item');
            if (btnData.includes('_edit')) {
                const planName = btnData.replace("_edit", "");
                editDetails({
                    [planName]: planDetails[planName]
                });
            } else {
                const planName = btnData.replace("_delete", "");
                deleteRecord(planName);
            }
        });
    });
}

function deleteRecord(planName) {
    let dataToDeleteFromDB = ref(database, `development/plan_details/${planName}`);
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