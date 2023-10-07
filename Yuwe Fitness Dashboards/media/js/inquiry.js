class FormValidator {
    constructor(formId, alertContainerId) {
        this.form = document.getElementById(formId);
        this.alertContainer = document.getElementById(alertContainerId);
    }

    initialize() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            if (this.validateForm()) {
                this.getFormData();
            }
        });
    }

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

    validateForm() {
        let valid = true;
        const name = this.form.elements.name.value.trim();
        const email = this.form.elements.email.value.trim();
        const phone = this.form.elements.phone.value.trim();
        const gender = this.form.elements.gender.value;
        const goals = this.form.elements.goals.value;
        const preferredTime = this.form.elements.preferredTime.value;

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

        if (email === '') {
            valid = false;
            this.form.elements.email.classList.add('is-invalid');
        } else {
            this.form.elements.email.classList.remove('is-invalid');
        }

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

        if (gender === '') {
            valid = false;
            this.form.elements.gender.classList.add('is-invalid');
        } else {
            this.form.elements.gender.classList.remove('is-invalid');
        }

        if (preferredTime === '') {
            valid = false;
            this.form.elements.preferredTime.classList.add('is-invalid');
        } else {
            this.form.elements.preferredTime.classList.remove('is-invalid');
        }

        return valid;
    }

    getFormData() {
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]:checked');
        const services = Array.from(checkboxes).map(checkbox => checkbox.value);

        const sendUpdateToWhatsApp = this.form.elements.sendUpdate.checked;

        const dataToSend = {
            name: this.form.elements.name.value.trim(),
            email: this.form.elements.email.value.trim(),
            phone: `+91${this.form.elements.phone.value.trim()}`,
            gender: this.form.elements.gender.value,
            services: services,
            preferredTime: this.form.elements.preferredTime.value,
            goal: this.form.elements.goals.value,
            sendUpdateToWhatsApp: sendUpdateToWhatsApp ? true : false
        };

        this.sendDataToFlutterFunction(JSON.stringify(dataToSend));
        this.form.reset();
    }

    setData(data) {
        const servicesContainer = this.form.querySelector('#services-checkbox');

        // Clear any existing checkboxes
        servicesContainer.innerHTML = '';

        // Create checkboxes for each service in the data
        data.services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'form-check form-check-inline service-item';

            const checkbox = document.createElement('input');
            checkbox.className = 'form-check-input';
            checkbox.type = 'checkbox';
            checkbox.id = service.toLowerCase(); // Use a lowercase ID for consistency

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = service.toLowerCase(); // Match the ID

            label.textContent = service;

            serviceItem.appendChild(checkbox);
            serviceItem.appendChild(label);

            servicesContainer.appendChild(serviceItem);
        });
    }



    sendDataToFlutterFunction(formData) {
        SendDataToFlutter.postMessage(formData);
    }
}

const formValidator = new FormValidator('enquiryForm', 'alertContainer');
formValidator.initialize();

function isThisYuWeWebPage() {
    return true;
}

let dummyData = {
    "services": ["Yoga", "Zumba"]
}

// formValidator.setData(dummyData);