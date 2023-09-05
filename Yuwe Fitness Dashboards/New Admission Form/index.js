const conditionButtons = document.querySelectorAll(".condition-button");
const otherInput = document.getElementById("additional-medical-info");

// JavaScript to add a custom validation message for the consent checkbox
const consentCheckbox = document.getElementById('consent-agree');
const consentError = document.getElementById('consent-error');

consentCheckbox.addEventListener('invalid', function (event) {
    event.preventDefault(); // Prevent the default browser error message
    consentError.textContent = 'You must agree to proceed.';
    consentCheckbox.focus();
});

consentCheckbox.addEventListener('change', function () {
    consentError.textContent = ''; // Clear the error message when the checkbox is changed
});

conditionButtons.forEach(button => {
    button.addEventListener("click", function () {
        this.classList.toggle("selected");
        // if (this !== otherButton) {
        //     otherInput.value = "";
        // }
    });
});

const form = document.getElementById('admission-form');
const maritalStatusSelect = document.getElementById('marital-status');
const anniversaryDateGroup = document.getElementById('anniversary-date-group');

maritalStatusSelect.addEventListener('change', function () {
    if (maritalStatusSelect.value === 'married') {
        anniversaryDateGroup.style.display = 'block';
    } else {
        anniversaryDateGroup.style.display = 'none';
    }
});

form.addEventListener('submit', function (event) {
    validateForm();
    event.preventDefault();
    console.log("hi");
});

function validateConsent() {
    const consentCheckbox = document.getElementById("consent-agree");

    if (!consentCheckbox.checked) {
        alert("Please agree to the terms before submitting the form.");
        return false;
    }

    return true;
}

function validateForm() {
    if (!validateConsent()) {
        return;
    }

    // Add your form submission logic here
    // ...
}

function togglePregnancyMonths(show) {
    const pregnancyMonthsContainer = document.getElementById('pregnancy-months-container');
    const pregnancyMonthsInput = document.getElementById('pregnancy-months');

    pregnancyMonthsContainer.style.display = show ? 'block' : 'none';
    pregnancyMonthsInput.disabled = !show;

    if (!show) {
        pregnancyMonthsInput.value = '';
    }
}

function togglePreviousActivity(show) {
    const previousActivityDetailsContainer = document.getElementById('previous-activity-details-container');
    const previousActivityDetailsInput = document.getElementById('previous-activity-details');

    previousActivityDetailsContainer.style.display = show ? 'block' : 'none';
    previousActivityDetailsInput.disabled = !show;

    if (!show) {
        previousActivityDetailsInput.value = '';
    }
}

function toggleMedicationDetails(show) {
    const medicationDetailsContainer = document.getElementById('medication-details-container');
    const medicationDetailsInput = document.getElementById('medication-details');

    medicationDetailsContainer.style.display = show ? 'block' : 'none';
    medicationDetailsInput.disabled = !show;

    if (!show) {
        medicationDetailsInput.value = '';
    }
}

function togglePhysicianDetails(show) {
    const physicianDetailsContainer = document.getElementById('physician-details-container');
    const physicianDetailsInput = document.getElementById('physician-details');

    physicianDetailsContainer.style.display = show ? 'block' : 'none';
    physicianDetailsInput.disabled = !show;

    if (!show) {
        physicianDetailsInput.value = '';
    }
}

function toggleInjuryDetails(show) {
    const injuryDetailsContainer = document.getElementById('injury-details-container');
    const injuryDetailsTextarea = document.getElementById('injury-details');

    injuryDetailsContainer.style.display = show ? 'block' : 'none';
    injuryDetailsTextarea.disabled = !show;

    if (!show) {
        injuryDetailsTextarea.value = '';
    }
}

function toggleOtherReasonDetails(show) {
    const otherReasonDetailsContainer = document.getElementById('other-reason-details-container');
    const otherReasonDetailsTextarea = document.getElementById('other-reason-details');

    otherReasonDetailsContainer.style.display = show ? 'block' : 'none';
    otherReasonDetailsTextarea.disabled = !show;

    if (!show) {
        otherReasonDetailsTextarea.value = '';
    }
}

function togglePhysicalActivityDetails(show) {
    const physicalActivityDetailsContainer = document.getElementById('physical-activity-details-container');
    const physicalActivityDetailsInput = document.getElementById('physical-activity-details');

    physicalActivityDetailsContainer.style.display = show ? 'block' : 'none';
    physicalActivityDetailsInput.disabled = !show;

    if (!show) {
        physicalActivityDetailsInput.value = '';
    }
}

function toggleSurgeryDetails(show) {
    const surgeryDetailsContainer = document.getElementById('surgery-details-container');
    const surgeryDetailsInput = document.getElementById('surgery-details');

    surgeryDetailsContainer.style.display = show ? 'block' : 'none';
    surgeryDetailsInput.disabled = !show;

    if (!show) {
        surgeryDetailsInput.value = '';
    }
}

// Function to handle checkbox selection for "I don't have any major medical condition"
function handleMajorMedicalConditionCheckbox() {
    const noneConditionCheckbox = document.getElementById("major-condition-none");
    const conditionCheckboxes = document.querySelectorAll("input[name='health-condition[]']");
    const otherConditionDetails = document.getElementById("other-medical-condition-details");

    if (noneConditionCheckbox.checked) {
        // If "I don't have any major medical condition" is checked, uncheck other condition checkboxes
        conditionCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = true;
        });

        // Disable and hide the other condition details textarea
        otherConditionDetails.style.display = "none";
        document.getElementById("additional-medical-info").disabled = true;
    } else {
        // If "I don't have any major medical condition" is unchecked, enable other condition checkboxes
        conditionCheckboxes.forEach(checkbox => {
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
    const otherConditionCheckbox = document.getElementById("condition-other");
    const otherConditionDetails = document.getElementById("other-medical-condition-details");

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
document.getElementById("major-condition-none").addEventListener("change", handleMajorMedicalConditionCheckbox);
document.getElementById("condition-other").addEventListener("change", handleOtherMedicalConditionCheckbox);

// Initially, check the state of "I don't have any major medical condition" checkbox
handleMajorMedicalConditionCheckbox();
// Also, check the state of "Other Medical Condition" checkbox
handleOtherMedicalConditionCheckbox();

// JavaScript to ensure at least one checkbox is checked or the "I don't have any major medical condition" checkbox is checked
const checkboxes = document.querySelectorAll('input[type="checkbox"][name="health-condition[]"]');
const noMajorConditionCheckbox = document.querySelector('input[type="checkbox"][name="major-medical-condition[]"][value="None"]');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const atLeastOneChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        noMajorConditionCheckbox.setCustomValidity('');
        noMajorConditionCheckbox.checked = false; // Uncheck "I don't have any major medical condition"
        noMajorConditionCheckbox.disabled = atLeastOneChecked; // Disable if at least one checkbox is checked
    });
});

noMajorConditionCheckbox.addEventListener('change', () => {
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck all medical condition checkboxes if "I don't have any major medical condition" is checked
    });
});