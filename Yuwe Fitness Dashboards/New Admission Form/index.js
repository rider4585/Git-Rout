const conditionButtons = document.querySelectorAll(".condition-button");
const otherInput = document.getElementById("additional-medical-info");

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