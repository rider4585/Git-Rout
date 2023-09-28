// Global variable to store diet information
let dietJSON = {
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
    'additional-instructions': '',
    'BMR' : ''
};

// Function to create a new row for the UI
function createUi(section, index, itemName, itemQuantity, fat, carbs, protein, calories) {
    const newItem = document.createElement('li');
    newItem.className = 'item';
    newItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center w-100">
            <div>
                <strong>${itemName}</strong><br>
                <span class="s-bold">Quantity</span>: ${itemQuantity}<br>
                <span class="s-bold">Fat</span>: ${fat}g, <span class="s-bold">Carbs</span>: ${carbs}g, <span class="s-bold">Protein</span>: ${protein}g<br>
                <span class="s-bold">Calories</span>: ${calories}
            </div>
            <button class="btn btn-danger btn-sm remove-item" data-section="${section}" data-index="${index}">Remove</button>
        </div>
    `;

    // Get the respective container by section ID
    const sectionContainer = document.getElementById(`${section}-list`);

    // Append the new item to the container
    sectionContainer.appendChild(newItem);
}

// Function to handle saving meal item
function saveMealItem(section) {
    return function () {
        const itemName = document.getElementById(`${section}Item`).value;
        const itemQuantity = document.getElementById(`${section}Quantity`).value;
        const fat = document.getElementById(`${section}Fats`).value;
        const carbs = document.getElementById(`${section}Carbs`).value;
        const protein = document.getElementById(`${section}Protein`).value;
        const calories = document.getElementById(`${section}Calories`).value;

        // Add meal item to dietJSON with a unique index
        const index = dietJSON[section].length;
        dietJSON[section].push({
            index,
            itemName,
            itemQuantity,
            fat,
            carbs,
            protein,
            calories,
        });

        // Create UI for meal item
        createUi(section, index, itemName, itemQuantity, fat, carbs, protein, calories);

        // Clear input fields
        document.getElementById(`${section}Item`).value = '';
        document.getElementById(`${section}Quantity`).value = '';
        document.getElementById(`${section}Fats`).value = '';
        document.getElementById(`${section}Carbs`).value = '';
        document.getElementById(`${section}Protein`).value = '';
        document.getElementById(`${section}Calories`).value = '';
    };
}

// Function to update the UI for a specific section
function updateUi(section) {
    // Get the respective container by section ID
    const sectionContainer = document.getElementById(`${section}-list`);
    // Clear the current UI for the section
    sectionContainer.innerHTML = '';

    // Rebuild the UI based on the updated dietJSON data
    if (dietJSON[section]) {
        dietJSON[section].forEach((item) => {
            createUi(section, item.index, item.itemName, item.itemQuantity, item.fat, item.carbs, item.protein, item.calories);
        });
    }
}

// Function to remove meal item by index
function removeMealItem(section, index) {
    // Remove the item from the dietJSON array
    dietJSON[section] = dietJSON[section].filter(item => item.index !== index);

    // Update the UI for the section
    updateUi(section);
}

// Event listeners for modal "Save" buttons for each section
// Event listeners for form submissions for each section
document.getElementById('breakfast-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and page reloading
    saveMealItem('breakfast')();
    $('#breakfastModal').modal('hide'); // Close the modal
});

document.getElementById('lunch-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and page reloading
    saveMealItem('lunch')();
    $('#lunchModal').modal('hide'); // Close the modal
});

document.getElementById('snack-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and page reloading
    saveMealItem('snack')();
    $('#snackModal').modal('hide'); // Close the modal
});

document.getElementById('dinner-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and page reloading
    saveMealItem('dinner')();
    $('#dinnerModal').modal('hide'); // Close the modal
});

// Event listener for item removal
document.querySelector('.container').addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-item')) {
        const section = event.target.getAttribute('data-section');
        const index = parseInt(event.target.getAttribute('data-index'));
        if (section === 'breakfast' || section === 'lunch' || section === 'snack' || section === 'dinner') {
            // Display a confirmation dialog
            const confirmRemove = window.confirm("Are you sure you want to remove this item?");
            if (confirmRemove) {
                // Remove the item if the user confirms
                removeMealItem(section, index);
            }
        }
    }
});

// Add an event listener for the "Submit Diet" button
// Function to handle the "Submit Diet" button click event
function sendData() {
    // Display a confirmation dialog
    // if(dietJSON.breakfast.length == 0 || dietJSON.lunch.length == 0 || dietJSON.snack.length == 0 || dietJSON.dinner.length == 0){
    //     alert('Please ');
    // }

    const confirmSubmit = window.confirm("Are you sure you want to submit this diet?");
    if (confirmSubmit) {
        // Perform the submission action here
        // For demonstration purposes, you can clear the diet data:
        dietJSON["additional-instructions"] = document.getElementById('additionalInstructions').value || 'Drink 4-5 liters of water daily, without fail - NO COMPROMISE ON THIS';
        dietJSON['BMR'] = document.getElementById('initialBMR').value;
        console.log(JSON.stringify(dietJSON));
        SendDataToFlutter.postMessage(JSON.stringify(dietJSON));

        // Inform the user that the diet has been submitted (you can replace this with your actual submission logic)
        alert("Your diet has been submitted.");
    }
}

function setData(data) {
    data = JSON.parse(data);
    const bmrInput = document.getElementById('initialBMR');
    bmrInput.value = data?.gender && data?.weight && data?.height && data?.age
    ? calculateBMR(data)
    : '';

}

function calculateBMR(data) {
    let bmr = 0;

    if (data.gender.toLowerCase() === 'male') {
        // For men: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) + 5
        bmr = 10 * data.weight + 6.25 * parseFloat(data.height) - 5 * data.age + 5;
    } else if (data.gender.toLowerCase() === 'female') {
        // For women: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (years) - 161
        bmr = 10 * data.weight + 6.25 * parseFloat(data.height) - 5 * data.age - 161;
    }

    return bmr;
}

// Add an event listener for the "Submit Diet" button
document.getElementById('submit-diet').addEventListener('click', function () {
    sendData();
});

function isThisYuWeWebPage() {
    return true;
}

// Initial UI update
updateUi('breakfast');
updateUi('lunch');
updateUi('snack');
updateUi('dinner');

const data = {
    gender: 'female',
    weight: 60,
    height: 165,
    age: 30,
};

// setData(JSON.stringify(data));