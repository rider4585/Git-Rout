class ReadUserInput {
    constructor() {
        this.inputForm = document.getElementById('input-form');
        this.jobDescription = document.getElementById('job-description-input');
        this.jobDescriptionDiv = document.getElementById('job-description');
        this.init();
    }

    init() {
        this.inputForm.addEventListener('submit', (event) => this.readDataFromInputField(event));
    }

    readDataFromInputField(event) {
        event.preventDefault();
        this.jobDescriptionDiv.innerText = this.jobDescription.value;
        // console.log(this.jobDescription.value);
        window.print();
    }
}

const readUserInput = new ReadUserInput();

// window.onbeforeunload = function () {
//     return "Are you sure ";
// };