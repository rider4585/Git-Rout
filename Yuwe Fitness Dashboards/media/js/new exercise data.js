import {
    app,
    database,
    ref,
    onValue,
    update,
    remove
} from "./firebase_setup.js";
// Define a class to manage exercises
class ExerciseManager {
    // Constructor to initialize properties and attach event listeners
    constructor() {
        // Create a modal instance
        this.modal = new bootstrap.Modal(document.getElementById("addDataModal"));

        // Get the accordion container element
        this.accordionContainer = document.getElementById("accordionBodyParts");

        // Get the save data button
        this.saveDataButton = document.getElementById("saveDataButton");

        // Get the Modal header
        this.modalHeader = document.getElementById('addDataModalLabel');

        // Get the add exercise btn
        this.addExerciseBtn = document.getElementById("#addDataModal");

        // Initialize exerciseDataDB reference
        this.exerciseDataDB = ref(database, 'development/exercise_name');

        // Initialize the editing item ID
        this.editingItemId = null;

        // Initialize the example JSON data
        this.exampleJSON = {};

        // Initialize the exercise manager by attaching event listeners
        this.init();
    }

    // Initialize the exercise manager
    init() {
        // Attach event listener to modal hidden event
        document.getElementById("addDataModal").addEventListener("hidden.bs.modal", () => this.clearInputFields());

        // Initialize data from Firebase when the page loads
        this.initDataFromFirebase();
    }

    initDataFromFirebase() {
        onValue(this.exerciseDataDB, (snapshot) => {
            const data = snapshot.val();
            if (data !== null && Object.keys(data).length !== 0) {
                this.exampleJSON = data;
                this.createUIFromJSON(this.exampleJSON); // Update the UI with fetched data
            }
        }, (error) => {
            alert(error.message);
        });
    }

    // Create an accordion item and append it to the container
    createAccordionItem(title, values) {
        // Generate a unique ID for the accordion item
        const id = title.trim().replace(/\s+/g, "-");

        // Create the accordion item element
        const accordionItem = document.createElement("div");
        accordionItem.id = `accordionItem_${id}`;
        accordionItem.classList.add("accordion-item");
        accordionItem.dataset.exerciseName = title.trim();
        accordionItem.innerHTML = `
            <!-- Accordion header -->
            <h2 class="accordion-header" id="heading${id}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="false" aria-controls="collapse${id}">
                    ${title}
                </button>
            </h2>
            <!-- Accordion body -->
            <div id="collapse${id}" class="accordion-collapse collapse" aria-labelledby="heading${id}" data-bs-parent="#accordionBodyParts">
                <div class="accordion-body">
                    <!-- Display exercise details -->
                    <p><strong>Muscle Involved</strong>: ${values["Muscle Involved"]}</p>
                    <p><strong>Joint Involved</strong>: ${values["Joint Involved"]}</p>
                    <p><strong>Type of Exercise</strong>: ${values["Type of Exercise"]}</p>
                    <p><strong>Equipment Used</strong>: ${values["Equipment Used"]}</p>
                    <p><strong>Workout Splits</strong>: ${values["Workout Splits"]}</p>
                    <p><strong>Location</strong>: ${values["Location"]}</p>
                    <p><strong>Form and Technique</strong>: ${values["Form and Technique"]}</p>
                    <p><strong>Images Link</strong>: ${values["Images Link"].join(", ")}</p>
                    <p><strong>GIF Link</strong>: ${values["GIF Link"].join(", ")}</p>
                    <p><strong>Video Link</strong>: ${values["Video Link"]}</p>
                    <p><strong>Benefits</strong>: ${values["Benefits"]}</p>
                    <button class="btn btn-secondary" onclick="exerciseManager.editAccordionItem('${title.trim()}')">Edit</button>
                    <button class="btn btn-danger" onclick="exerciseManager.deleteAccordionItem('${title.trim()}')">Delete</button>
                </div>
            </div>
        `;

        // Append the accordion item to the container
        this.accordionContainer.appendChild(accordionItem);
    }

    // Update the UI based on JSON data
    createUIFromJSON(data) {
        // Clear the container
        this.accordionContainer.innerHTML = '';

        // Iterate through data entries and create accordion items
        Object.entries(data).forEach(([title, values]) => {
            this.createAccordionItem(title, values);
        });
    }

    // Save exercise data
    saveData() {
        // Collect form data
        const formData = {
            "Muscle Involved": document.getElementById("muscleInput").value,
            "Joint Involved": document.getElementById("jointInput").value,
            "Type of Exercise": document.getElementById("exerciseTypeInput").value,
            "Equipment Used": document.getElementById("equipmentInput").value,
            "Workout Splits": document.getElementById("splitsInput").value,
            "Location": document.getElementById("locationInput").value,
            "Form and Technique": document.getElementById("techniqueInput").value,
            "Images Link": document
                .getElementById("imagesInput")
                .value.split(",")
                .map((link) => link.trim()),
            "GIF Link": document
                .getElementById("gifInput")
                .value.split(",")
                .map((link) => link.trim()),
            "Video Link": document.getElementById("videoInput").value,
            "Benefits": document.getElementById("benefitsInput").value,
        };

        const exerciseTitleInput = document.getElementById('titleInput');
        const exerciseTitle = exerciseTitleInput.value.toUpperCase();
        const previousTitle = exerciseTitleInput.dataset.previousTitle;

        formData.Keywords = this.generateKeywords(formData, exerciseTitle);

        if (previousTitle && previousTitle !== exerciseTitle) {
            console.log(previousTitle);
            // Remove the previous exercise data with the old title from the database
            remove(ref(database, `development/exercise_name/${previousTitle}`))
                .then(() => {
                    // Update the exampleJSON object with the new title
                    this.exampleJSON[exerciseTitle] = this.exampleJSON[previousTitle];
                    // Delete the old title from the exampleJSON object
                    delete this.exampleJSON[previousTitle];
                })
                .catch((error) => {
                    console.log(`Error updating exercise data: ${error.message}`);
                });
        }

        // Update the exercise data in the exampleJSON object
        this.exampleJSON[exerciseTitle] = formData;

        // Update the exercise data in the database
        update(this.exerciseDataDB, {
                [exerciseTitle]: this.exampleJSON[exerciseTitle],
            })
            .then(() => {
                alert("Exercise data saved successfully!");
                // Update the UI
                this.createUIFromJSON(this.exampleJSON);
                // Clear input fields
                this.clearInputFields();
                // Reset the previous title in the dataset
                exerciseTitleInput.dataset.previousTitle = "";
                // Hide the modal
                this.modal.hide();
            })
            .catch((error) => {
                alert(`Error saving exercise data: ${error.message}`);
            });

        this.modal.hide();
    }


    // Edit an accordion item
    editAccordionItem(itemId) {

        this.modalHeader.innerHTML = 'Edit Exercise Data';
        this.editingItemId = itemId;
        const itemData = this.exampleJSON[itemId];

        this.modal.show();

        // Store the previous title in the dataset
        document.getElementById("titleInput").dataset.previousTitle = itemId;

        document.getElementById("titleInput").value = itemId;
        document.getElementById("muscleInput").value =
            itemData["Muscle Involved"];
        document.getElementById("jointInput").value =
            itemData["Joint Involved"];
        document.getElementById("exerciseTypeInput").value =
            itemData["Type of Exercise"];
        document.getElementById("equipmentInput").value =
            itemData["Equipment Used"];
        document.getElementById("splitsInput").value =
            itemData["Workout Splits"];
        document.getElementById("locationInput").value = itemData["Location"];
        document.getElementById("techniqueInput").value =
            itemData["Form and Technique"];
        document.getElementById("imagesInput").value =
            itemData["Images Link"].join(", ");
        document.getElementById("gifInput").value =
            itemData["GIF Link"].join(", ");
        document.getElementById("videoInput").value = itemData["Video Link"];
        document.getElementById("benefitsInput").value = itemData["Benefits"];
    }

    // Delete an accordion item
    deleteAccordionItem(itemId) {
        delete this.exampleJSON[itemId];
        this.createUIFromJSON(this.exampleJSON);

        const dataToDeleteFromDB = ref(database, `development/exercise_name/${itemId}`);
        if (confirm(`Do you really want to delete data of ${itemId}`)) {
            remove(dataToDeleteFromDB)
                .then(() => {
                    alert("Successfully removed exercise."); // Display success toast
                    // ... (other code)
                })
                .catch((error) => {
                    alert("Error when removing exercise data"); // Display error toast
                    console.error(error);
                    // ... (other code)
                });
        }
    }

    // Clear input fields
    clearInputFields() {
        const inputFields = [
            "titleInput",
            "muscleInput",
            "jointInput",
            "exerciseTypeInput",
            "equipmentInput",
            "splitsInput",
            "locationInput",
            "techniqueInput",
            "imagesInput",
            "gifInput",
            "videoInput",
            "benefitsInput",
        ];

        inputFields.forEach((fieldId) => {
            document.getElementById(fieldId).value = "";
        });
    }

    // Generate keywords from form data
    generateKeywords(formData, exerciseTitle) {
        const values = Object.values(formData)
            .map(value => value.toString().toLowerCase())
            .filter(value => value !== ""); // Filter out empty values

        values.push(exerciseTitle.toLowerCase()); // Include exerciseTitle

        return values.join(" ");
    }
}

// Create an instance of ExerciseManager
const exerciseManager = new ExerciseManager();

// Explicitly define exerciseManager in the global scope
window.exerciseManager = exerciseManager;

// Attach event listener to saveDataButton using exerciseManager instance
exerciseManager.saveDataButton.addEventListener("click", () => {
    exerciseManager.saveData();
});

// Attach event listeners to edit buttons using exerciseManager instance
document.querySelectorAll(".accordion-item .btn-secondary").forEach((button) => {
    button.addEventListener("click", (event) => {
        const exerciseTitle = event.target.dataset.exerciseName;
        exerciseManager.editAccordionItem(exerciseTitle);
    });
});

document.getElementById('addExercise').addEventListener('click', function () {
    document.getElementById("addDataModalLabel").innerHTML = "Add New Exercise";
    document.getElementById("titleInput").dataset.previousTitle = "";
});