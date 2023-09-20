const conditionButtons = document.querySelectorAll(".condition-button");
const consentCheckbox = document.getElementById("consent-agree");
const consentError = document.getElementById("consent-error");
const interestContainer = document.getElementById('interests');
const interestError = document.getElementById('interests-error');
const focusOnInterests = document.getElementById('focus-interests');
const healthConditionError = document.getElementById('health-condition-error');
const goalsArray = document.querySelector('#interests');
let isSetData = false;

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

    if (isSetData) {
        disableAllCheckboxesAndRadios();
        document.getElementById('other-medical-condition-details').setAttribute('disabled', '');
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
function toggleOtherMedicalConditionCheckbox(conditionsNotInList, isValue) {
    const otherConditionCheckbox = document.getElementById("condition-other");
    const otherConditionDetails = document.getElementById("other-medical-condition-details-container");

    toggleElementVisibility("other-medical-condition-details-container", otherConditionCheckbox.checked);

    if (isValue) {
        setField("other-medical-condition-details", conditionsNotInList.join(", "), true);
    } else {
        setField("other-medical-condition-details", "", false);
    }

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
    // const servicesInterested = getSelectedInterests();
    const formFilledDate = new Date().toISOString().split('T')[0];
    // const goals = getGoals();

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
        age: age.toString(),
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
    const hasHealthIssues = checkIfHealthIssues();
    const goals = getGoals();
    const servicesInterested = getSelectedInterests();

    const masterJson = {
        personal_details: personalDetailsJSON,
        emergency_contact: emergencyContactJSON,
        health_questions: healthQuestionJSON,
        health_conditions: healthConditionsJSON,
        has_health_issues: hasHealthIssues,
        goals_services: {
            goals: goals,
            services: servicesInterested,
        }
    };
    SendDataToFlutter.postMessage(JSON.stringify(masterJson));
    // console.log(masterJson);
    // console.log(JSON.stringify(masterJson));
    // return masterJson;
}

function checkIfHealthIssues() {
    let hasHealthCondition = false;
    let checkedRadioOptions = document.querySelectorAll('.hasHealthCondition input[type="radio"]:checked');
    if (checkedRadioOptions.length > 0) {
        checkedRadioOptions.forEach(radioOption => {
            if (radioOption.value == 'yes') {
                hasHealthCondition = true;
            }
        });
    }

    let checkedHealthCondition = document.querySelectorAll('input[name="health-condition[]"]:checked');
    if (checkedHealthCondition.length > 0) {
        hasHealthCondition = true;
    }

    return hasHealthCondition;
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
    isSetData = true;

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

    if (data?.data?.personal_details) {
        populatePersonalDetails(data.data.personal_details);
    }

    if (data?.data?.emergency_contact) {
        populateEmergencyContact(data.data.emergency_contact);
    }

    if (data?.data?.health_conditions) {
        populateHealthConditions(data.data.health_conditions);
    }

    if (data?.data?.health_questions) {
        populateHealthQuestions(data.data.health_questions);
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

function populatePersonalDetails(personalDetails) {
    // Populate form fields with personalDetails object properties
    setField("full-name", personalDetails.name, true);
    setField("email", personalDetails.email, true);
    setField("mobile", personalDetails.phoneNumber.replace('+91', ''), true); // Remove '+91'
    setField("birth-date", personalDetails.selectedBirthDate, true);
    setField("address", personalDetails.address, true);
    setField("gender", personalDetails.gender, true);
    setField("blood-group", personalDetails.bloodGroup, true);
    setField("marital-status", personalDetails.maritalStatus, true);

    const anniversaryDateGroup = document.getElementById("anniversary-date-group");
    if (personalDetails?.maritalStatus === 'Married') {
        anniversaryDateGroup.style.display = "block";
        setField("anniversary-date", personalDetails.anniversaryDate, true);
    } else {
        anniversaryDateGroup.style.display = "none";
        setField("anniversary-date", "", true);
    }

    const allInterests = document.querySelectorAll("input[name='interest[]']");
    allInterests.forEach((interest) => {
        if (personalDetails.selectedServices) {
            if (personalDetails.selectedServices.includes(interest.value)) {
                interest.checked = true;
                interest.disabled = true; // Make it non-editable
            }
        }
    });

    if (personalDetails.goals) {
        setField("goals", personalDetails.goals.join(', '), true);
    }
}

function populateEmergencyContact(emergencyContact) {
    setField("emergency_contact_name", emergencyContact.name, true);
    setField("emergency_contact_number", emergencyContact.contact, true);
}

function populateHealthConditions(healthConditions) {
    const noneConditionCheckbox = document.getElementById("major-condition-none");
    const conditionCheckboxes = document.querySelectorAll("input[name='health-condition[]']:not(#major-condition-none)");

    if (healthConditions.length === 0) {
        noneConditionCheckbox.checked = true;
        conditionCheckboxes.forEach((checkbox) => {
            toggleElementVisibility(checkbox.id, false);
        });
    } else {
        noneConditionCheckbox.checked = false;
        conditionCheckboxes.forEach((checkbox) => {
            if (healthConditions.includes(checkbox.value)) {
                checkbox.checked = true;
                checkbox.disabled = true; // Make it non-editable
            } else {
                checkbox.checked = false;
            }
            toggleElementVisibility(checkbox.id, true);
        });
    }

    // Handle the "Other Medical Condition" checkbox and details
    const otherConditionCheckbox = document.getElementById("condition-other");
    const otherConditionDetails = document.getElementById("other-medical-condition-details");

    // Find conditions not in the checkbox list
    const conditionsNotInList = healthConditions.filter((condition) => {
        return condition !== "Other Medical Condition" &&
            !Array.from(conditionCheckboxes).some((checkbox) => checkbox.value === condition);
    });

    if (conditionsNotInList.length > 0) {
        otherConditionCheckbox.checked = true;
        toggleOtherMedicalConditionCheckbox(conditionsNotInList, true);
    } else {
        otherConditionCheckbox.checked = false;
        toggleOtherMedicalConditionCheckbox(conditionsNotInList, false);
    }
}

function populateHealthQuestions(healthQuestions) {
    for (const question in healthQuestions) {
        if (healthQuestions.hasOwnProperty(question)) {
            const value = healthQuestions[question];
            const radioName = getRadioNameByQuestion(question);
            const radio = document.querySelector(`input[name="${radioName}"][value="${value}"]`);

            if (radio) {
                if (value) {
                    radio.checked = true;
                } else {
                    radio.checked = false;
                }
                radio.disabled = true; // Make it non-editable
            }

            const inputName = getSectionIdByQuestion(question);
            const input = document.getElementById(inputName);

            if (input) {
                if (value) {
                    if (input.style.display === 'none') {
                        input.style.display = 'block';
                    }
                    setField(inputName.replace("-container", ""), value, true); // Make it non-editable
                }
            }
        }
    }
}

function setField(id, value, disable = false) {
    const element = document.getElementById(id);
    if (element && value) {
        element.value = value || "";
        if (disable) {
            element.disabled = true;
        }
    }
}

function disableAllCheckboxesAndRadios() {
    const checkboxesAndRadios = document.querySelectorAll("input[type='checkbox'], input[type='radio']");

    checkboxesAndRadios.forEach((input) => {
        input.disabled = true;
    });

    // Additionally, you may want to disable elements specifically in the medical conditions section
    const medicalConditionCheckboxes = document.querySelectorAll(".form-check-input");
    medicalConditionCheckboxes.forEach((input) => {
        input.disabled = true;
    });

}

function getRadioNameByQuestion(question) {
    const questionRadioMap = {
        'Has a doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?': 'subsection-one-question-1',
        'Do you feel pain in your chest while doing any physical activity?': 'subsection-one-question-2',
        'In the past month, have you had chest pain when you were not doing physical activity?': 'subsection-one-question-3',
        'Do you lose your balance because of dizziness or do you ever lose consciousness?': 'subsection-one-question-4',
        'Do you have a bone or joint problem that could be made worse by a change in your physical activity?': 'subsection-one-question-5',
        'Is your doctor currently prescribing drugs for blood pressure or heart condition?': 'subsection-one-question-6',
        'Do you know of any other reason why you should not do physical activity?': 'subsection-one-question-7',
        'Are you currently doing any physical activity?': 'subsection-two-question-1',
        'Have you done any physical activity before?': 'subsection-two-question-3',
        'Are you currently taking any medications?': 'subsection-two-question-4',
        'Are you pregnant?': 'subsection-two-question-5',
        'Do you have a physician?': 'subsection-two-question-7',
        'Have you gone through any surgery in the past 6 months?': 'subsection-two-question-8',
        'Have you experienced any injuries due to accidents?': 'subsection-two-question-9',
        'Do you smoke?': 'subsection-two-question-11',
        'Family Health History': 'subsection-two-question-12'
    };

    return questionRadioMap[question] || "";
}

function getSectionIdByQuestion(question) {
    const questionSectionMap = {
        'Other Reason Details': 'other-reason-details-container',
        'Details of Current Physical Activity': 'physical-activity-details-container',
        'Details of Previous Physical Activity': 'previous-activity-details-container',
        'Number of Pregnancy Months': 'pregnancy-months-container',
        'Physician Details': 'physician-details-container',
        'Surgery Details': 'surgery-details-container',
        'Injury Details': 'injury-details-container',
        'Details of Alcohol Consumption': 'alcohol-consumption-details-container',
        'Family Health History': 'family-health-history-container',
    };

    return questionSectionMap[question] || "";
}

const testJson = {
    "services": ['Yoga', 'Zumba'],
    // "hideElements" : ['section-three', 'submit-button'],
    "data": {
        "personal_details": {
            "name": "raviraj Mahendra Bugge",
            "email": "raviraj@gmail.com",
            "phoneNumber": "+917798476162",
            "selectedBirthDate": "1999-10-24",
            "address": "ubfiweug",
            "gender": "Male",
            "bloodGroup": "AB+",
            "maritalStatus": "Married",
            "anniversaryDate": "1999-10-24",
            "formFilledDate": "2023-09-12",
            "selectedServices": ["Zumba"],
            "age": "23",
            "goals": ["uhediueh"]
        },
        "emergency_contact": {
            "name": "Ravi",
            "contact": "7798476162"
        },
        "health_questions": {
            "Has a doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?": "yes",
            "Do you feel pain in your chest while doing any physical activity?": "yes",
            "In the past month, have you had chest pain when you were not doing physical activity?": "yes",
            "Do you lose your balance because of dizziness or do you ever lose consciousness?": "yes",
            "Do you have a bone or joint problem that could be made worse by a change in your physical activity?": "yes",
            "Is your doctor currently prescribing drugs for blood pressure or heart condition?": "yes",
            "Do you know of any other reason why you should not do physical activity?": "yes",
            "Other Reason Details": "Hello",
            "Are you currently doing any physical activity?": "yes",
            "Details of Current Physical Activity": "Hello",
            "Have you done any physical activity before?": "yes",
            "Details of Previous Physical Activity": "Hello",
            "Are you currently taking any medications?": "yes",
            "Specify the medications you are currently taking": "Hello",
            "Are you pregnant?": "yes",
            "Number of Pregnancy Months": "6",
            "Do you have a physician?": "yes",
            "Physician Details": "Hello",
            "Have you gone through any surgery in the past 6 months?": "yes",
            "Surgery Details": "Hello",
            "Have you experienced any injuries due to accidents?": "yes",
            "Injury Details": "Hello",
            "Details of Alcohol Consumption": "yes",
            "Do you smoke?": "yes",
            "Family Health History": "yes"
        },
        "health_conditions": ["Gout", "Emphysema", "Swollen or Painful Joints", "Other", "new", "old"]
    }
}

// setData(testJson);