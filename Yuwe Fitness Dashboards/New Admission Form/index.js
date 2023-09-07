const conditionButtons = document.querySelectorAll(".condition-button");
const otherInput = document.getElementById("additional-medical-info");

// JavaScript to add a custom validation message for the consent checkbox
const consentCheckbox = document.getElementById("consent-agree");
const consentError = document.getElementById("consent-error");

const interestContainer = document.getElementById('interests');
const interestError = document.getElementById('interests-error');
const focusOnInterests = document.getElementById('focus-interests');

const healthConditionError = document.getElementById('health-condition-error');

consentCheckbox.addEventListener("invalid", function (event) {
    event.preventDefault(); // Prevent the default browser error message
    consentError.textContent = "You must agree to proceed.";
    consentCheckbox.scrollIntoView();
});

consentCheckbox.addEventListener("change", function () {
    consentError.textContent = ""; // Clear the error message when the checkbox is changed
});

conditionButtons.forEach((button) => {
    button.addEventListener("click", function () {
        this.classList.toggle("selected");
        // if (this !== otherButton) {
        //     otherInput.value = "";
        // }
    });
});

const form = document.getElementById("admission-form");
const maritalStatusSelect = document.getElementById("marital-status");
const anniversaryDateGroup = document.getElementById("anniversary-date-group");

maritalStatusSelect.addEventListener("change", function () {
    if (maritalStatusSelect.value === "Married") {
        anniversaryDateGroup.style.display = "block";
    } else {
        anniversaryDateGroup.style.display = "none";
    }
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    if(validateSelectedServices() && validateSelectedHealthConditions()){
        onFormSubmit();
    }
});


function validateSelectedServices() {
    const allInterests = document.querySelectorAll("input[name='interest[]']:checked");
    if (allInterests.length == 0) {
        focusOnInterests.scrollIntoView();
        interestError.innerHTML = 'Please specify your interested services';
        return false;
    } else {
        interestError.innerHTML = '';
        return true;
    }
}

function validateSelectedHealthConditions() {
    const allHealthConditions = document.querySelectorAll("input[name='health-condition[]']:checked");
    const noneConditionCheckbox = document.getElementById("major-condition-none");
    if(allHealthConditions.length == 0){
        noneConditionCheckbox.scrollIntoView();
        healthConditionError.innerHTML = 'At least one of the conditions should be selected';
        return true;
    } else {
        healthConditionError.innerHTML = '';
        return false;
    }
}

function togglePregnancyMonths(show) {
    const pregnancyMonthsContainer = document.getElementById(
        "pregnancy-months-container"
    );
    const pregnancyMonthsInput = document.getElementById("pregnancy-months");

    pregnancyMonthsContainer.style.display = show ? "block" : "none";
    pregnancyMonthsInput.disabled = !show;

    if (!show) {
        pregnancyMonthsInput.value = "";
    }
}

function togglePreviousActivity(show) {
    const previousActivityDetailsContainer = document.getElementById(
        "previous-activity-details-container"
    );
    const previousActivityDetailsInput = document.getElementById(
        "previous-activity-details"
    );

    previousActivityDetailsContainer.style.display = show ? "block" : "none";
    previousActivityDetailsInput.disabled = !show;

    if (!show) {
        previousActivityDetailsInput.value = "";
    }
}

function toggleMedicationDetails(show) {
    const medicationDetailsContainer = document.getElementById(
        "medication-details-container"
    );
    const medicationDetailsInput = document.getElementById("medication-details");

    medicationDetailsContainer.style.display = show ? "block" : "none";
    medicationDetailsInput.disabled = !show;

    if (!show) {
        medicationDetailsInput.value = "";
    }
}

function togglePhysicianDetails(show) {
    const physicianDetailsContainer = document.getElementById(
        "physician-details-container"
    );
    const physicianDetailsInput = document.getElementById("physician-details");

    physicianDetailsContainer.style.display = show ? "block" : "none";
    physicianDetailsInput.disabled = !show;

    if (!show) {
        physicianDetailsInput.value = "";
    }
}

function toggleInjuryDetails(show) {
    const injuryDetailsContainer = document.getElementById(
        "injury-details-container"
    );
    const injuryDetailsTextarea = document.getElementById("injury-details");

    injuryDetailsContainer.style.display = show ? "block" : "none";
    injuryDetailsTextarea.disabled = !show;

    if (!show) {
        injuryDetailsTextarea.value = "";
    }
}

function toggleOtherReasonDetails(show) {
    const otherReasonDetailsContainer = document.getElementById(
        "other-reason-details-container"
    );
    const otherReasonDetailsTextarea = document.getElementById(
        "other-reason-details"
    );

    otherReasonDetailsContainer.style.display = show ? "block" : "none";
    otherReasonDetailsTextarea.disabled = !show;

    if (!show) {
        otherReasonDetailsTextarea.value = "";
    }
}

function togglePhysicalActivityDetails(show) {
    const physicalActivityDetailsContainer = document.getElementById(
        "physical-activity-details-container"
    );
    const physicalActivityDetailsInput = document.getElementById(
        "physical-activity-details"
    );

    physicalActivityDetailsContainer.style.display = show ? "block" : "none";
    physicalActivityDetailsInput.disabled = !show;

    if (!show) {
        physicalActivityDetailsInput.value = "";
    }
}

function toggleSurgeryDetails(show) {
    const surgeryDetailsContainer = document.getElementById(
        "surgery-details-container"
    );
    const surgeryDetailsInput = document.getElementById("surgery-details");

    surgeryDetailsContainer.style.display = show ? "block" : "none";
    surgeryDetailsInput.disabled = !show;

    if (!show) {
        surgeryDetailsInput.value = "";
    }
}

// Function to handle checkbox selection for "I don't have any major medical condition"
function handleMajorMedicalConditionCheckbox() {
    console.log('change');
    const noneConditionCheckbox = document.getElementById("major-condition-none");
    const conditionCheckboxes = document.querySelectorAll("input[name='health-condition[]']:not(#major-condition-none)");
    const otherConditionDetails = document.getElementById(
        "other-medical-condition-details"
    );

    if (noneConditionCheckbox.checked) {
        console.log("hi");
        // If "I don't have any major medical condition" is checked, uncheck other condition checkboxes
        conditionCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
            checkbox.disabled = true;
        });

        // Disable and hide the other condition details textarea
        otherConditionDetails.style.display = "none";
        document.getElementById("additional-medical-info").disabled = true;
    } else {
        console.log("hello");
        // If "I don't have any major medical condition" is unchecked, enable other condition checkboxes
        conditionCheckboxes.forEach((checkbox) => {
            checkbox.disabled = false;
        });

        // Enable the other condition details textarea if the "Other Medical Condition" checkbox is checked
        const otherConditionCheckbox = document.getElementById("condition-other");
        if (otherConditionCheckbox.checked) {
            otherConditionDetails.style.display = "block";
            document.getElementById("additional-medical-info").disabled = false;
        }
    }
}

// Function to handle checkbox selection for "Other Medical Condition"
function handleOtherMedicalConditionCheckbox() {
    //updated the code
    console.log('change');
    const otherConditionCheckbox = document.getElementById("condition-other");
    const otherConditionDetails = document.getElementById(
        "other-medical-condition-details"
    );

    if (otherConditionCheckbox.checked) {
        // If "Other Medical Condition" is checked, show and enable the other condition details textarea
        otherConditionDetails.style.display = "block";
        document.getElementById("additional-medical-info").disabled = false;
    } else {
        // If "Other Medical Condition" is unchecked, hide and disable the other condition details textarea
        otherConditionDetails.style.display = "none";
        document.getElementById("additional-medical-info").disabled = true;
    }
}

// Add event listeners to handle checkbox interactions
document
    .getElementById("major-condition-none")
    .addEventListener("change", handleMajorMedicalConditionCheckbox);
document
    .getElementById("condition-other")
    .addEventListener("change", handleOtherMedicalConditionCheckbox);

// Initially, check the state of "I don't have any major medical condition" checkbox
handleMajorMedicalConditionCheckbox();
// Also, check the state of "Other Medical Condition" checkbox
handleOtherMedicalConditionCheckbox();

// JavaScript to ensure at least one checkbox is checked or the "I don't have any major medical condition" checkbox is checked
const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][name="health-condition[]"]'
);
const noMajorConditionCheckbox = document.querySelector(
    '#major-condition-none'
);

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const atLeastOneChecked = Array.from(checkboxes).some(
            (checkbox) => checkbox.checked
        );
        noMajorConditionCheckbox.setCustomValidity("");
        noMajorConditionCheckbox.checked = false; // Uncheck "I don't have any major medical condition"
        noMajorConditionCheckbox.disabled = atLeastOneChecked; // Disable if at least one checkbox is checked
    });
});

noMajorConditionCheckbox.addEventListener("change", () => {
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // Uncheck all medical condition checkboxes if "I don't have any major medical condition" is checked
    });
});

function calculateAge(birthDate) {
    const today = new Date();
    const birthDateArray = birthDate.split("-");
    const birthYear = parseInt(birthDateArray[0]);
    const birthMonth = parseInt(birthDateArray[1]) - 1; // Month is zero-based
    const birthDay = parseInt(birthDateArray[2]);
    let age = today.getFullYear() - birthYear;

    if (
        today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
        age--;
    }

    return age;
}

function generatePersonalDetailsJSON() {
    // Collect form data
    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const phoneNumber = `+91${document.getElementById("mobile").value}`;
    const selectedBirthDate = document.getElementById("birth-date").value;
    const address = document.getElementById("address").value;
    const gender = document.getElementById('gender').value;
    const bloodGroup = document.getElementById('blood-group').value;
    const maritalStatus = document.getElementById('marital-status').value;
    let anniversaryDate = "";
    let servicesInterested = getSelectedInterests();
    if (maritalStatus == 'Married') {
        anniversaryDate = document.getElementById('anniversary-date').value;
    }

    // Date object
    const date = new Date();

    let currentDay = String(date.getDate()).padStart(2, '0');

    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

    let currentYear = date.getFullYear();

    // we will display the date as DD-MM-YYYY 

    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

    const formFilledDate = currentDate;

    // Calculate age
    const age = calculateAge(selectedBirthDate);

    // Construct JSON object
    const personalDetails = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        selectedBirthDate: selectedBirthDate,
        address: address,
        gender: gender,
        bloodGroup: bloodGroup,
        maritalStatus: maritalStatus,
        anniversaryDate: anniversaryDate,
        formFilledDate: formFilledDate,
        selectedServices: servicesInterested,
        age: age.toString(), // Convert age to string
    };

    // Return the JSON object
    return personalDetails;
}

// Example usage when the form is submitted
function onFormSubmit() {
    let personalDetailsJSON = generatePersonalDetailsJSON();
    console.log(JSON.stringify(personalDetailsJSON, null, 2));
    // You can send this JSON to your desired destination or use it as needed.
}

function getSelectedInterests() {
    let selectedInterests = [];
    const allInterests = document.querySelectorAll("input[name='interest[]']:checked");
    for (const interest of allInterests) {
        selectedInterests.push(interest.value);
    }
    return selectedInterests;
}