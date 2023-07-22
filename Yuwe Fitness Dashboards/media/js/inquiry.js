// Define a FormValidator class
class FormValidator {
    constructor(formId, alertContainerId) {
        this.form = document.getElementById(formId);
        this.alertContainer = document.getElementById(alertContainerId);
    }

    // Initialize form validation
    initialize() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            if (this.validateForm()) {
                const formData = this.getFormData();
                console.log('Form submitted successfully!');
                console.log(formData);
                this.sendDataToFlutterFunction(JSON.stringify(formData));
                this.form.reset();
            }
        });
    }

    // Display an alert message
    showAlert(message) {
        this.alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `;
        const closeButton = this.alertContainer.querySelector('.close');
        closeButton.addEventListener('click', () => {
            this.alertContainer.innerHTML = '';
        });
    }

    // Validate the form fields
    validateForm() {
        let valid = true;
        const name = this.form.elements.name.value.trim();
        const email = this.form.elements.email.value.trim();
        const phone = this.form.elements.phone.value.trim();
        const gender = this.form.elements.gender.value;
        const goals = this.form.elements.goals.value;
        const preferredTime = this.form.elements.preferredTime.value;

        // Name validation
        if (name === '') {
            valid = false;
            this.form.elements.name.classList.add('is-invalid');
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            valid = false;
            this.form.elements.name.classList.add('is-invalid');
            this.showAlert('Name should only contain letters and spaces.');
        } else {
            this.form.elements.name.classList.remove('is-invalid');
        }

        // Email validation
        if (email === '') {
            valid = false;
            this.form.elements.email.classList.add('is-invalid');
        } else {
            this.form.elements.email.classList.remove('is-invalid');
        }

        // Phone number validation
        if (phone === '') {
            valid = false;
            this.form.elements.phone.classList.add('is-invalid');
        } else if (!/^\d{10}$/.test(phone)) {
            valid = false;
            this.form.elements.phone.classList.add('is-invalid');
            this.showAlert('Mobile number should be 10 digits long.');
        } else {
            this.form.elements.phone.classList.remove('is-invalid');
        }

        // Gender validation
        if (gender === '') {
            valid = false;
            this.form.elements.gender.classList.add('is-invalid');
        } else {
            this.form.elements.gender.classList.remove('is-invalid');
        }

        // Preferred Time validation
        if (preferredTime === '') {
            valid = false;
            this.form.elements.preferredTime.classList.add('is-invalid');
        } else {
            this.form.elements.preferredTime.classList.remove('is-invalid');
        }

        return valid;
    }

    // Get form data as JSON object
    getFormData() {
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]:checked');
        const services = Array.from(checkboxes).map(checkbox => checkbox.value);

        const sendUpdateToWhatsApp = this.form.elements.sendUpdate.checked;

        return {
            name: this.form.elements.name.value.trim(),
            email: this.form.elements.email.value.trim(),
            phone: `+91${this.form.elements.phone.value.trim()}`,
            gender: this.form.elements.gender.value,
            services: services,
            preferredTime: this.form.elements.preferredTime.value,
            goal: this.form.elements.goals.value,
            sendUpdateToWhatsApp: sendUpdateToWhatsApp ? true : false
        };
    }

    // Send form data to Flutter
    sendDataToFlutterFunction(formData) {
        SendDataToFlutter.postMessage(formData)
    }
}

// Create an instance of FormValidator and initialize it
const formValidator = new FormValidator('enquiryForm', 'alertContainer');
formValidator.initialize();

function isThisYuWeWebPage() {
    return true;
}