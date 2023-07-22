class Form {
    constructor() {

        this.masterJSON = {};
        this.isMarried = false;

        this.buttons = document.querySelectorAll('.button');
        this.otherBtn = document.getElementById('otherBtn');
        this.inputBoxContainer = document.getElementById('inputBoxContainer');
        this.otherInput = document.getElementById('otherInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.dobInput = document.querySelector('#inputDOB');
        this.maritalStatusInput = document.querySelector('#inputMaritalStatus');
        this.anniversaryDateInputDiv = document.querySelector('.inputAnniversaryDiv');
        this.anniversaryDateInput = document.querySelector('#inputAnniversary');
        this.sectionOneSubmitBtn = document.querySelector('.section-one-btn');
        this.sectionTwoSubmitBtn = document.querySelector('.section-two-btn');
        this.sectionThreeSubmitBtn = document.querySelector('.section-three-btn');
        this.sectionOneElements = document.querySelector('.section-one');
        this.sectionTwoElements = document.querySelector('.section-two');
        this.sectionThreeElements = document.querySelector('.section-three');

        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.otherBtn.addEventListener('click', () => this.toggleInputBox());
        this.maritalStatusInput.addEventListener('change', () => this.toggleAnniversaryVisibility());
        this.sectionOneSubmitBtn.addEventListener('click', () => this.showSectionTwo());
        this.sectionTwoSubmitBtn.addEventListener('click', () => this.showSectionThree());
        this.sectionThreeSubmitBtn.addEventListener('click', () => this.submitCompleteForm());

        this.buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                button.classList.toggle('selected');
                if (button === this.otherBtn) {
                    this.toggleInputBox();
                }
            });
        });
    }

    calculateAge() {
        const dob = this.dobInput.value;
        const dobDate = new Date(dob);
        const todayDate = new Date();

        let age = todayDate.getFullYear() - dobDate.getFullYear();
        const monthDiff = todayDate.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && todayDate.getDate() < dobDate.getDate())) {
            age--;
        }

        return age;
    }

    toggleAnniversaryVisibility() {
        if (this.maritalStatusInput.value === 'Married') {
            this.isMarried = true;
            this.anniversaryDateInputDiv.classList.remove('hide');
        } else {
            this.isMarried = false;
            this.anniversaryDateInputDiv.classList.add('hide');
        }
    }

    getAnniversaryDate() {
        if (this.isMarried && this.isMarried != false) {
            let anniversaryDate = document.querySelector('#inputAnniversary').value;
            return anniversaryDate;
        } else {
            return null;
        }
    }

    toggleInputBox() {
        this.inputBoxContainer.style.display = this.otherBtn.classList.contains('selected') ? 'inline-block' : 'none';
    }

    showSectionTwo() {
        this.masterJSON.personalInfo = this.generateJSONForSectionOne();
        this.sectionOneElements.classList.add('hide');
        this.sectionTwoElements.classList.remove('hide');
    }

    showSectionThree() {
        let healthQuestions = {};
        this.sectionTwoElements.classList.remove('show');
        this.sectionTwoElements.classList.add('hide');
        this.sectionThreeElements.classList.remove('hide');
        healthQuestions.sectionOneQuestions = this.generateJSONForSectionTwoA();
        healthQuestions.sectionTwoQuestions = this.generateJSONForSectionTwoB();
        healthQuestions.medicalConditions = this.generateJSONForSectionTwoC();
        this.masterJSON.healthQuestions = healthQuestions;
    }

    generateJSONForSectionOne() {
        let sectionOneFormData = {};

        sectionOneFormData.name = document.getElementById("inputFullName").value;
        sectionOneFormData.address = document.getElementById("inputAddress").value;
        sectionOneFormData.phoneNumber = `+91${document.getElementById("inputMobile").value}`;
        sectionOneFormData.email = document.getElementById("inputEmail").value;
        sectionOneFormData.selectedBirthDate = document.getElementById("inputDOB").value;
        sectionOneFormData.age = this.calculateAge();
        sectionOneFormData.gender = document.getElementById("inputGender").value;
        sectionOneFormData.bloodGroup = document.getElementById("inputBloodGroup").value;
        sectionOneFormData.maritalStatus = document.getElementById("inputMaritalStatus").value;
        sectionOneFormData.anniversaryDate = this.getAnniversaryDate();
        console.log(sectionOneFormData);

        return sectionOneFormData;
    }

    generateJSONForSectionTwoA() {

        return {
            "question-1": document.querySelector('input[name="section-one-question-1"]:checked').value,
            "question-2": document.querySelector('input[name="section-one-question-2"]:checked').value,
            "question-3": document.querySelector('input[name="section-one-question-3"]:checked').value,
            "question-4": document.querySelector('input[name="section-one-question-4"]:checked').value,
            "question-5": document.querySelector('input[name="section-one-question-5"]:checked').value,
            "question-6": document.querySelector('input[name="section-one-question-6"]:checked').value,
            "question-7": document.querySelector('input[name="section-one-question-7"]:checked').value
        }

    }

    generateJSONForSectionTwoB() {

        return {
            "question-1": document.querySelector('input[name="section-two-question-1"]:checked').value,
            "question-2": document.querySelector('input[name="section-two-question-2"]').value,
            "question-3": document.querySelector('input[name="section-two-question-3"]').value,
            "question-4": document.querySelector('input[name="section-two-question-4"]').value,
            "question-5": document.querySelector('input[name="section-two-question-5"]:checked').value,
            "question-6": document.querySelector('input[name="section-two-question-6"]').value,
            "question-7": document.querySelector('input[name="section-two-question-7"]').value,
            "question-9": document.querySelector('input[name="section-two-question-8"]:checked').value,
            "question-10": document.querySelector('input[name="section-two-question-9"]').value,
            "question-11": document.querySelector('input[name="section-two-question-10"]').value,
            "question-12": document.querySelector('input[name="section-two-question-11"]:checked').value,
            "question-13": document.querySelector('input[name="section-two-question-12"]:checked').value,
            "emergency_contact_name": document.querySelector('input[name="emergency_contact_name"]').value,
            "emergency_contact_number": document.querySelector('input[name="emergency_contact_number"]').value
        }

    }

    generateJSONForSectionTwoC() {
        const buttons = document.querySelectorAll('.medical-condition-btn');
        const otherInput = document.querySelector('#otherInput');
        const conditions = [];

        for (const element of buttons) {
            if (element.classList.contains('selected')) {
                conditions.push(element.textContent);
            }
        }

        const otherConditionsInputValue = otherInput.value.trim();
        if (otherConditionsInputValue !== '') {
            const otherConditions = otherConditionsInputValue.split(',').map(condition => condition.trim());
            conditions.push(...otherConditions);
        }

        return conditions;
    }

    submitCompleteForm() {
        const consentCheckbox = document.getElementById('consent-checkbox');
        const consentGiven = consentCheckbox.checked;

        if (!consentGiven) {
            consentCheckbox.focus();
            consentCheckbox.style.textShadow = "text-shadow: 0px 0px 15px rgba(232,72,72,0.85)";
        } else {
            this.masterJSON.isConsentGiven = true;
            this.sendData(this.masterJSON);
        }
    }

    setData(data) {
        if (data != "" && data != null && data != undefined) {
            if (data.hasOwnProperty('name')) {
                document.getElementById("inputFullName").value = data['name'];
            }

            if (data.hasOwnProperty('phoneNumber')) {
                document.getElementById("inputMobile").value = data['phoneNumber'];
            }
        }
    }

    sendData(formData) {
        console.log(JSON.stringify(formData));
        SendDataToFlutter.postMessage(JSON.stringify(formData));
    }
}

function isThisYuWeWebPage() {
    return true;
}

function setData(data) {
    const newForm = new Form();
    newForm.setData(data);
}

// setData({'name':'ravi'});