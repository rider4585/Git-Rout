import {
    app,
    database,
    ref,
    onValue,
    update,
    remove,
    get
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
        document.getElementById("addDataModal").addEventListener("hidden.bs.modal", () => {
            this.clearInputFields();
            this.editingItemId = null; // Clear the editing item ID when the modal is closed
        });

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

        // Set default values for undefined or null fields
        values["Muscle Involved"] = values["Muscle Involved"] || "";
        values["Joint Involved"] = values["Joint Involved"] || "";
        values["Type of Exercise"] = values["Type of Exercise"] || "";
        values["Equipment Used"] = values["Equipment Used"] || "";
        values["Workout Splits"] = values["Workout Splits"] || "";
        values["Location"] = values["Location"] || "";
        values["Form and Technique"] = values["Form and Technique"] || "";
        values["Images Link"] = values["Images Link"] || [];
        values["GIF Link"] = values["GIF Link"] || [];
        values["Video Link"] = values["Video Link"] || "";
        values["Benefits"] = values["Benefits"] || "";
        values["Body Part"] = values["Body Part"] || "";

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
                    <p><strong>Body Part</strong>: ${values["Body Part"]}</p>
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
            "Benefits": document.getElementById("benefitsInput").value,
            "Body Part": document.getElementById("bodyPartInput").value,
            "Equipment Used": document.getElementById("equipmentInput").value,
            "Form and Technique": document.getElementById("techniqueInput").value,
            "GIF Link": document
                .getElementById("gifInput")
                .value.split(",")
                .map((link) => link.trim()),
            "Images Link": document
                .getElementById("imagesInput")
                .value.split(",")
                .map((link) => link.trim()),
            "Joint Involved": document.getElementById("jointInput").value,
            "Location": document.getElementById("locationInput").value,
            "Muscle Involved": document.getElementById("muscleInput").value,
            "Type of Exercise": document.getElementById("exerciseTypeInput").value,
            "Video Link": document.getElementById("videoInput").value,
            "Workout Splits": document.getElementById("splitsInput").value,
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
        document.getElementById("bodyPartInput").value = itemData["Body Part"];
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
        const dataToDeleteFromDB = ref(database, `development/exercise_name/${itemId}`);

        // Check if the reference exists in the database
        get(dataToDeleteFromDB)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    if (confirm(`Do you really want to delete data of ${itemId}`)) {
                        remove(dataToDeleteFromDB)
                            .then(() => {
                                alert("Successfully removed exercise.");
                                delete this.exampleJSON[itemId];
                                this.createUIFromJSON(this.exampleJSON);
                                document.querySelector('#searchInput').value = "";
                            })
                            .catch((error) => {
                                console.error("Error when removing exercise data:", error);
                            });
                    }
                } else {
                    alert(`Exercise data with title '${itemId}' does not exist. This has to be deleted manually`);
                }
            })
            .catch((error) => {
                console.log(`Error checking exercise data: ${error.message}`);
            });
    }


    // Clear input fields
    clearInputFields() {
        const inputFields = [
            "titleInput",
            "muscleInput",
            "bodyPartInput",
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
            document.getElementById(fieldId).value = ""; // Use .value to clear input fields
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

// Attach event listener to clear search input button
document.getElementById("clearSearchInput").addEventListener("click", () => {
    document.getElementById("searchInput").value = ""; // Clear the search input field
    filterAccordionItems(""); // Show all accordion items
});

// Function to filter accordion items based on search query
function filterAccordionItems(query) {
    const accordionItems = document.querySelectorAll(".accordion-item");
    const noResultsMessage = document.getElementById("noResultsMessage");

    let anyResults = false; // Flag to track if any matching results are found

    accordionItems.forEach((accordionItem) => {
        const exerciseTitle = accordionItem.dataset.exerciseName.toLowerCase();
        if (exerciseTitle.includes(query)) {
            accordionItem.style.display = "block"; // Show the item
            anyResults = true; // Set the flag to true if any matching result is found
        } else {
            accordionItem.style.display = "none"; // Hide the item
        }
    });

    // Update the display property of the noResultsMessage based on the flag
    noResultsMessage.style.display = anyResults ? "none" : "block";
}


// Attach event listener to search input field
document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    filterAccordionItems(query);
});