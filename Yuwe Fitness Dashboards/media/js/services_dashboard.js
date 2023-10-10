// services_dashboard.js

// Import Firebase-related functions and initialize Firebase app (similar to exercise dashboard)
import {
    app,
    database,
    ref,
    onValue,
    update,
    remove,
    get
} from "./firebase_setup.js";

// Define a class to manage gym services
class ServiceManager {
    constructor() {
        // Create a modal instance
        this.modal = new bootstrap.Modal(document.getElementById("addDataModal"));

        // Get the services container element
        this.servicesContainer = document.getElementById("serviceEntries");

        // Get the save service button
        this.saveServiceButton = document.getElementById("saveServiceButton");

        // Get the modal's title/header element
        this.modalHeader = document.querySelector(".modal-title"); // Reference to the modal's title/header

        // Initialize serviceDataDB reference
        this.serviceDataDB = ref(database, 'development/services');

        // Initialize the editing item ID
        this.editingItemId = null;

        // Initialize the example JSON data
        this.exampleJSON = {};

        // Initialize the service manager by attaching event listeners
        this.init();
    }


    // Initialize the service manager
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
        onValue(this.serviceDataDB, (snapshot) => {
            const data = snapshot.val();
            if (data !== null && Object.keys(data).length !== 0) {
                this.exampleJSON = data;
                this.createUIFromJSON(this.exampleJSON); // Update the UI with fetched data
            }
        }, (error) => {
            alert(error.message);
        });
    }

    // Create a service entry as an accordion item and append it to the container
    createServiceEntry(title, benefits, description, mode, price, maxDiscountPrice, daysDuration, weeksDuration, counselling, dietUpdate) {
        // Generate a unique ID for the service entry
        const id = title.trim().replace(/\s+/g, "-");

        // Create the accordion item element
        const accordionItem = document.createElement("div");
        accordionItem.id = `accordionItem_${id}`;
        accordionItem.classList.add("accordion-item");

        // Create the accordion header
        accordionItem.innerHTML = `
        <h2 class="accordion-header" id="heading${id}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="false" aria-controls="collapse${id}">
                ${title}
            </button>
        </h2>
        <div id="collapse${id}" class="accordion-collapse collapse" aria-labelledby="heading${id}" data-bs-parent="#accordionServices">
            <div class="accordion-body">
                <p><strong>Benefits:</strong> ${benefits}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Mode:</strong> ${mode}</p>
                <p><strong>Price:</strong> ₹${price}</p>
                <p><strong>Maximum price with discount:</strong> ₹${maxDiscountPrice}</p>
                <p><strong>Duration (Days):</strong> ${daysDuration} Days</p>
                <p><strong>Duration (Weeks):</strong> ${weeksDuration} Weeks</p>
                <p><strong>counselings:</strong> ${counselling}</p>
                <p><strong>Diet update:</strong> ${dietUpdate}</p>

                <button class="btn btn-secondary" onclick="serviceManager.editServiceEntry('${title.trim()}')">Edit</button>
                <button class="btn btn-danger" onclick="serviceManager.deleteServiceEntry('${title.trim()}')">Delete</button>
            </div>
        </div>
    `;

        // Append the accordion item to the container
        this.servicesContainer.appendChild(accordionItem);
    }


    createUIFromJSON(data) {
        // Clear the container
        this.servicesContainer.innerHTML = ''; // This line is causing the error

        // Iterate through data entries and create service entries
        Object.entries(data).forEach(([title, values]) => {
            this.createServiceEntry(title, values.benefits, values.description, values.mode, values.price, values.maxDiscountPrice, values.durationDays, values.durationWeeks, values.counselling, values.dietUpdate);
        });
    }


    // Save service data
    saveService() {
        // Collect form data
        const titleInput = document.getElementById("titleInput");
        const benefitsInput = document.getElementById("benefitsInput");
        const descriptionInput = document.getElementById("descriptionInput");
        const modeInput = document.getElementById("modeInput");
        const priceInput = document.getElementById("priceInput");
        const maxDiscountPriceInput = document.getElementById("maxDiscountPriceInput");
        const durationDaysInput = document.getElementById("durationDaysInput");
        const durationWeeksInput = document.getElementById("durationWeeksInput");
        const counsellingInput = document.getElementById("counsellingInput");
        const dietUpdateInput = document.getElementById("dietUpdateInput");

        // Check if any of the required fields are empty
        if (
            titleInput.value.trim() === "" ||
            benefitsInput.value.trim() === "" ||
            descriptionInput.value.trim() === "" ||
            modeInput.value === "" ||
            priceInput.value.trim() === "" ||
            maxDiscountPriceInput.value.trim() === "" ||
            durationDaysInput.value.trim() === "" ||
            durationWeeksInput.value.trim() === "" ||
            counsellingInput.value.trim() === "" ||
            dietUpdateInput.value.trim() === ""
        ) {
            alert("Please fill in all required fields.");
            return; // Don't proceed if any required field is empty
        }
        // Collect form data
        const formData = {
            "benefits": document.getElementById("benefitsInput").value,
            "description": document.getElementById("descriptionInput").value,
            "mode": document.getElementById("modeInput").value,
            "price": parseFloat(document.getElementById("priceInput").value).toFixed(2),
            "maxDiscountPrice": parseFloat(document.getElementById("maxDiscountPriceInput").value).toFixed(2),
            "durationDays": parseInt(document.getElementById("durationDaysInput").value),
            "durationWeeks": parseInt(document.getElementById("durationWeeksInput").value),
            "counselling": parseInt(document.getElementById("counsellingInput").value),
            "dietUpdate": parseInt(document.getElementById("dietUpdateInput").value),
        };


        const serviceTitleInput = document.getElementById('titleInput');
        const serviceTitle = serviceTitleInput.value;
        const previousTitle = serviceTitleInput.dataset.previousTitle;

        if (previousTitle && previousTitle !== serviceTitle) {
            // Remove the previous service data with the old title from the database
            remove(ref(database, `development/services/${previousTitle}`))
                .then(() => {
                    // Delete the old title from the exampleJSON object
                    delete this.exampleJSON[previousTitle];
                })
                .catch((error) => {
                    console.log(`Error updating service data: ${error.message}`);
                });
        }

        // Update the service data in the exampleJSON object
        this.exampleJSON[serviceTitle] = formData;

        // Update the service data in the database
        update(this.serviceDataDB, {
                [serviceTitle]: this.exampleJSON[serviceTitle],
            })
            .then(() => {
                alert("Service data saved successfully!");
                // Update the UI
                this.createUIFromJSON(this.exampleJSON);
                // Clear input fields
                this.clearInputFields();
                // Reset the previous title in the dataset
                serviceTitleInput.dataset.previousTitle = "";
                // Hide the modal
                this.modal.hide();
            })
            .catch((error) => {
                console.log(error);
                alert(`Error saving service data: ${error.message}`);
            });

        this.modal.hide();
    }

    // Edit a service entry
    editServiceEntry(itemId) {

        this.modalHeader.innerHTML = 'Edit Plans Data';
        this.editingItemId = itemId;
        const itemData = this.exampleJSON[itemId];

        this.modal.show();

        // Store the previous title in the dataset
        document.getElementById("titleInput").dataset.previousTitle = itemId;

        document.getElementById("titleInput").value = itemId;
        document.getElementById("benefitsInput").value = itemData.benefits;
        document.getElementById("descriptionInput").value = itemData.description;
        document.getElementById("modeInput").value = itemData.mode;
        document.getElementById("priceInput").value = itemData.price;
        document.getElementById("maxDiscountPriceInput").value = itemData.maxDiscountPrice;
        document.getElementById("durationDaysInput").value = itemData.durationDays;
        document.getElementById("durationWeeksInput").value = itemData.durationWeeks;
        document.getElementById("counsellingInput").value = itemData.counselling;
        document.getElementById("dietUpdateInput").value = itemData.dietUpdate;
    }

    // Delete a service entry
    deleteServiceEntry(itemId) {
        const dataToDeleteFromDB = ref(database, `development/services/${itemId}`);

        // Check if the reference exists in the database
        get(dataToDeleteFromDB)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    if (confirm(`Do you really want to delete data of ${itemId}`)) {
                        remove(dataToDeleteFromDB)
                            .then(() => {
                                alert("Successfully removed service.");
                                delete this.exampleJSON[itemId];
                                this.createUIFromJSON(this.exampleJSON);
                            })
                            .catch((error) => {
                                console.error("Error when removing service data:", error);
                            });
                    }
                } else {
                    alert(`Service data with title '${itemId}' does not exist. This has to be deleted manually`);
                }
            })
            .catch((error) => {
                console.log(`Error checking service data: ${error.message}`);
            });
    }

    // Clear input fields
    clearInputFields() {
        const inputFields = [
            "titleInput",
            "benefitsInput",
            "descriptionInput",
            "modeInput",
            "priceInput",
            "maxDiscountPriceInput",
            "durationDaysInput",
            "durationWeeksInput",
            "counsellingInput",
            "dietUpdateInput",
        ];

        inputFields.forEach((fieldId) => {
            document.getElementById(fieldId).value = ""; // Use .value to clear input fields
        });
    }
}

// Create an instance of ServiceManager
const serviceManager = new ServiceManager();

// Explicitly define serviceManager in the global scope
window.serviceManager = serviceManager;

// Attach event listener to saveServiceButton using serviceManager instance
serviceManager.saveServiceButton.addEventListener("click", () => {
    serviceManager.saveService();
});

// Attach event listeners to edit buttons using serviceManager instance
document.querySelectorAll(".service-entry .btn-secondary").forEach((button) => {
    button.addEventListener("click", (event) => {
        const serviceTitle = event.target.dataset.serviceName;
        serviceManager.editServiceEntry(serviceTitle);
    });
});

document.getElementById('addService').addEventListener('click', function () {
    document.getElementById("addDataModalLabel").innerHTML = "Add New Service";
    document.getElementById("titleInput").dataset.previousTitle = "";
});