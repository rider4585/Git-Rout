const conditionButtons = document.querySelectorAll(".condition-button");
const consentCheckbox = document.getElementById("consent-agree");
const consentError = document.getElementById("consent-error");
const interestContainer = document.getElementById('interests');
const interestError = document.getElementById('interests-error');
const focusOnInterests = document.getElementById('focus-interests');
const healthConditionError = document.getElementById('health-condition-error');
const goalsArray = document.querySelector('#interests');

consentCheckbox.addEventListener("invalid", (event) => {
    event.preventDefault();
    consentError.textContent = "You must agree to proceed.";
    consentCheckbox.scrollIntoView();
});

consentCheckbox.addEventListener("change", () => {
    consentError.textContent = "";
});

conditionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.classList.toggle("selected");
    });
});

const form = document.getElementById("admission-form");
const maritalStatusSelect = document.getElementById("marital-status");
const anniversaryDateGroup = document.getElementById("anniversary-date-group");

maritalStatusSelect.addEventListener("change", () => {
    anniversaryDateGroup.style.display = maritalStatusSelect.value === "Married" ? "block" : "none";
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateSelectedServices() && validateSelectedHealthConditions()) {
        sendData();
    }
});

function validateSelectedServices() {
    const allInterests = document.querySelectorAll("input[name='interest[]']:checked");
    const isValid = allInterests.length > 0;
    interestError.innerHTML = isValid ? '' : 'Please specify your interested services';
    if (!isValid) focusOnInterests.scrollIntoView();
    return isValid;
}

function validateSelectedHealthConditions() {
    const allHealthConditions = document.querySelectorAll("input[name='health-condition[]']:checked");
    const noneConditionCheckbox = document.getElementById("major-condition-none");
    const isValid = allHealthConditions.length > 0 || noneConditionCheckbox.checked;
    healthConditionError.innerHTML = isValid ? '' : 'At least one of the conditions should be selected';
    if (!isValid) noneConditionCheckbox.scrollIntoView();
    return isValid;
}

function toggleElementVisibility(id, show) {
    const element = document.getElementById(id);
    element.style.display = show ? "block" : "none";

    // Check if the input element exists before trying to access its properties
    const input = document.getElementById(id.replace("-container", ""));
    if (input) {
        if (!show) {
            input.value = "";
            input.disabled = true;
        } else {
            input.disabled = false;
        }
    }
}

function togglePregnancyMonths(show) {
    toggleElementVisibility("pregnancy-months-container", show);
}

function togglePreviousActivity(show) {
    toggleElementVisibility("previous-activity-details-container", show);
}

function toggleMedicationDetails(show) {
    toggleElementVisibility("medication-details-container", show);
}

function togglePhysicianDetails(show) {
    toggleElementVisibility("physician-details-container", show);
}

function toggleInjuryDetails(show) {
    toggleElementVisibility("injury-details-container", show);
}

function toggleOtherReasonDetails(show) {
    toggleElementVisibility("other-reason-details-container", show);
}

function togglePhysicalActivityDetails(show) {
    toggleElementVisibility("physical-activity-details-container", show);
}

function toggleSurgeryDetails(show) {
    toggleElementVisibility("surgery-details-container", show);
}

// Function to handle checkbox selection for "I don't have any major medical condition"
function handleMajorMedicalConditionCheckbox() {
    const noneConditionCheckbox = document.getElementById("major-condition-none");
    const conditionCheckboxes = document.querySelectorAll("input[name='health-condition[]']:not(#major-condition-none)");
    const otherConditionTextarea = document.getElementById('other-medical-condition-details-container');
    const otherConditionCheckbox = document.getElementById("condition-other");

    conditionCheckboxes.forEach((checkbox) => {
        toggleElementVisibility(checkbox.id, !noneConditionCheckbox.checked);
    });

    // Toggle the "Other Medical Condition" section based on the checkbox state
    if (noneConditionCheckbox.checked) {
        toggleElementVisibility("condition-other", false);
        otherConditionCheckbox.checked = false; // Uncheck the "Other Medical Condition" checkbox
        toggleElementVisibility("other-medical-condition-details-container", false);
    }
}

// Function to handle checkbox selection for "Other Medical Condition"
function toggleOtherMedicalConditionCheckbox() {
    const otherConditionCheckbox = document.getElementById("condition-other");
    const otherConditionDetails = document.getElementById("other-medical-condition-details-container");
    
    toggleElementVisibility("other-medical-condition-details-container", otherConditionCheckbox.checked);
}


// Function to handle checkbox selection for "Other Medical Condition"
function handleOtherMedicalConditionCheckbox() {
    const otherConditionCheckbox = document.getElementById("condition-other");
    toggleElementVisibility("other-medical-condition-details-container", otherConditionCheckbox.checked);
}

// Add event listener to handle checkbox interactions when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Call handleMajorMedicalConditionCheckbox() to set the initial state
    handleMajorMedicalConditionCheckbox();

    // Also, check the state of "Other Medical Condition" checkbox
    handleOtherMedicalConditionCheckbox();

    // Add event listeners to handle checkbox interactions
    document.getElementById("major-condition-none").addEventListener("click", handleMajorMedicalConditionCheckbox);
    document.getElementById("condition-other").addEventListener("click", handleOtherMedicalConditionCheckbox);
});

function calculateAge(birthDate) {
    const today = new Date();
    const birthDateArray = birthDate.split("-");
    const birthYear = parseInt(birthDateArray[0]);
    const birthMonth = parseInt(birthDateArray[1]) - 1;
    const birthDay = parseInt(birthDateArray[2]);
    let age = today.getFullYear() - birthYear;

    if (today.getMonth() < birthMonth || (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
        age--;
    }

    return age;
}

function generatePersonalDetailsJSON() {
    const name = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const phoneNumber = `+91${document.getElementById("mobile").value}`;
    const selectedBirthDate = document.getElementById("birth-date").value;
    const address = document.getElementById("address").value;
    const gender = document.getElementById('gender').value;
    const bloodGroup = document.getElementById('blood-group').value;
    const maritalStatus = document.getElementById('marital-status').value;
    const anniversaryDate = maritalStatus === 'Married' ? document.getElementById('anniversary-date').value : "";
    const age = calculateAge(selectedBirthDate);
    const servicesInterested = getSelectedInterests();
    const formFilledDate = new Date().toISOString().split('T')[0];
    const goals = getGoals();

    return {
        name,
        email,
        phoneNumber,
        selectedBirthDate,
        address,
        gender,
        bloodGroup,
        maritalStatus,
        anniversaryDate,
        formFilledDate,
        selectedServices: servicesInterested,
        age: age.toString(),
        goals,
    };
}

function generateEmergencyContactJSON() {
    const emergencyContactName = document.querySelector('input[name="emergency_contact_name"]').value;
    const emergencyContactNumber = document.querySelector('input[name="emergency_contact_number"]').value;
    return {
        name: emergencyContactName,
        contact: emergencyContactNumber
    };
}

function sendData() {
    const personalDetailsJSON = generatePersonalDetailsJSON();
    const emergencyContactJSON = generateEmergencyContactJSON();
    const healthConditionsJSON = generateHealthConditionJSON();
    const healthQuestionJSON = generateHealthQuestionJSON();

    const masterJson = {
        personal_details: personalDetailsJSON,
        emergency_contact: emergencyContactJSON,
        health_questions: healthQuestionJSON,
        health_conditions: healthConditionsJSON
    };
    // SendDataToFlutter.postMessage(JSON.stringify(formData));
    console.log(masterJson);
    console.log(JSON.stringify(masterJson));
    // return masterJson;
}

function getSelectedInterests() {
    const selectedInterests = [];
    const allInterests = document.querySelectorAll("input[name='interest[]']:checked");
    allInterests.forEach((interest) => {
        selectedInterests.push(interest.value);
    });
    return selectedInterests;
}

function getGoals() {
    const goalsInput = document.getElementById("goals").value;
    const goalsArray = goalsInput.split(',').map((goal) => goal.trim()).filter((goal) => goal !== '');
    return goalsArray;
}

function generateHealthConditionJSON() {
    const noMajorConditionCheckbox = document.getElementById('major-condition-none');
    if (noMajorConditionCheckbox.checked) {
        return [];
    }

    const healthConditions = [];
    const checkboxes = document.querySelectorAll('input[name="health-condition[]"]:checked');
    checkboxes.forEach((checkbox) => {
        healthConditions.push(checkbox.value);
    });

    const otherConditionTextarea = document.getElementById('other-medical-condition-details').value.trim();
    const otherConditionsArray = otherConditionTextarea.split(',').map((condition) => condition.trim()).filter((condition) => condition !== '');

    healthConditions.push(...otherConditionsArray);
    return healthConditions;
}

function generateHealthQuestionJSON() {
    const healthQuestionJSON = {
        'Has a doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?': getRadioValue('subsection-one-question-1'),
        'Do you feel pain in your chest while doing any physical activity?': getRadioValue('subsection-one-question-2'),
        'In the past month, have you had chest pain when you were not doing physical activity?': getRadioValue('subsection-one-question-3'),
        'Do you lose your balance because of dizziness or do you ever lose consciousness?': getRadioValue('subsection-one-question-4'),
        'Do you have a bone or joint problem that could be made worse by a change in your physical activity?': getRadioValue('subsection-one-question-5'),
        'Is your doctor currently prescribing drugs for blood pressure or heart condition?': getRadioValue('subsection-one-question-6'),
        'Do you know of any other reason why you should not do physical activity?': getRadioValue('subsection-one-question-7'),
        'Other Reason Details': getInputValue('other-reason-details'),
        'Are you currently doing any physical activity?': getRadioValue('subsection-two-question-1'),
        'Details of Current Physical Activity': getInputValue('physical-activity-details'),
        'Have you done any physical activity before?': getRadioValue('subsection-two-question-3'),
        'Details of Previous Physical Activity': getInputValue('previous-activity-details'),
        'Are you currently taking any medications?': getRadioValue('subsection-two-question-4'),
        'Specify the medications you are currently taking': getInputValue('medication-details'),
        'Are you pregnant?': getRadioValue('subsection-two-question-5'),
        'Number of Pregnancy Months': getInputValue('pregnancy-months'),
        'Do you have a physician?': getRadioValue('subsection-two-question-7'),
        'Physician Details': getInputValue('physician-details'),
        'Have you gone through any surgery in the past 6 months?': getRadioValue('subsection-two-question-8'),
        'Surgery Details': getInputValue('surgery-details'),
        'Have you experienced any injuries due to accidents?': getRadioValue('subsection-two-question-9'),
        'Injury Details': getInputValue('injury-details'),
        'Details of Alcohol Consumption': getInputValue('alcohol-consumption-details'),
        'Do you smoke?': getRadioValue('subsection-two-question-11'),
        'Family Health History': getRadioValue('subsection-two-question-12')
    };

    return healthQuestionJSON;
}

function getRadioValue(name) {
    const selectedRadio = document.querySelector(`input[name="${name}"]:checked`);
    return selectedRadio ? selectedRadio.value : '';
}

function getInputValue(id) {
    return document.getElementById(id).value || '';
}

function isThisYuWeWebPage() {
    return true;
}

function setData(data) {
    let services = "";
    let elementsToHide = "";

    if (data?.services) {
        services = data.services;
        loadInterests(services);
    } else {
        alert('Gym Services not Found');
    }

    if (data?.hideElements) {
        elementsToHide = data.hideElements;
        hideElements(elementsToHide);
    }
}

function loadInterests(interested) {
    let goalsInnerHtml = '';

    for (const element of interested) {
        goalsInnerHtml += `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="interest-${element}" name="interest[]" value="${element}">
                            <label class="form-check-label" for="interest-${element}">
                                ${element}
                            </label>
                        </div>`;
    };

    goalsArray.innerHTML = goalsInnerHtml;
}

function hideElements(elements) {
    elements.forEach((elementId) => {
        const element = document.querySelector("." + elementId);
        if (element) {
            element.style.display = "none";
        }
    });
}

// Usage:
// const jsonData = `{
//     "personal_details": {
//         "name": "Raviraj",
//         "email": "ravi@gmail.com",
//         "phoneNumber": "+917798476162",
//         "selectedBirthDate": "1999-10-24",
//         "address": "iuhe",
//         "gender": "Male",
//         "bloodGroup": "AB+",
//         "maritalStatus": "Married",
//         "anniversaryDate": "",
//         "formFilledDate": "2023-09-10",
//         "selectedServices": ["Zumba", "Full Body"],
//         "age": "23",
//         "goals": ["slieghei"]
//     },
//     "emergency_contact": {
//         "name": "ravi",
//         "contact": "7798476162"
//     },
//     "health_questions": {
//         "Has a doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?": "no",
//         "Do you feel pain in your chest while doing any physical activity?": "no",
//         // ... (other health questions)
//     },
//     "health_conditions": ["Asthma", "Bronchitis", "Hernia"]
// }`;

// setData(`{"personal_details":{"name":"Raviraj","email":"ravi@gmail.com","phoneNumber":"+917798476162","selectedBirthDate":"1999-10-24","address":"iuhe","gender":"Male","bloodGroup":"AB+","maritalStatus":"Married","anniversaryDate":"","formFilledDate":"2023-09-10","selectedServices":["Zumba","Full Body"],"age":"23","goals":["slieghei"]},"emergency_contact":{"name":"ravi","contact":"7798476162"},"health_questions":{"Has a doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?":"no","Do you feel pain in your chest while doing any physical activity?":"no","In the past month, have you had chest pain when you were not doing physical activity?":"no","Do you lose your balance because of dizziness or do you ever lose consciousness?":"no","Do you have a bone or joint problem that could be made worse by a change in your physical activity?":"no","Is your doctor currently prescribing drugs for blood pressure or heart condition?":"no","Do you know of any other reason why you should not do physical activity?":"no","Other Reason Details":"","Are you currently doing any physical activity?":"no","Details of Current Physical Activity":"","Have you done any physical activity before?":"no","Details of Previous Physical Activity":"","Are you currently taking any medications?":"no","Specify the medications you are currently taking":"","Are you pregnant?":"no","Number of Pregnancy Months":"","Do you have a physician?":"no","Physician Details":"","Have you gone through any surgery in the past 6 months?":"no","Surgery Details":"","Have you experienced any injuries due to accidents?":"no","Injury Details":"","Details of Alcohol Consumption":"yes","Do you smoke?":"no","Family Health History":"no"},"health_conditions":["Asthma","Bronchitis","Hernia"]}`);
const testJson = {
    "services" : ['Yoga', 'Zumba'],
    // "hideElements" : ['section-three', 'submit-button']
}

setData(testJson);