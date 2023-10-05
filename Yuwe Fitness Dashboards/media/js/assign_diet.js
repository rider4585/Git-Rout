// Global variable to store diet information
let dietJSON = {
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
    'additional-instructions': '',
    'BMR': '',
    'isEditing': false
};

// Function to create a new row for the UI
function createUi(section, index, itemName, itemQuantity, fat, carbs, protein, calories) {
    const newItem = document.createElement('li');
    newItem.className = 'item';
    newItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center w-100">
            <div>
                <strong class="item-name">${itemName}</strong><br>
                <span class="s-bold">Quantity</span>: <span class="item-quantity">${itemQuantity}</span><br>
                <span class="s-bold">Fat</span>: <span class="item-fat">${fat}</span>g, <span class="s-bold">Carbs</span>: <span class="item-carbs">${carbs}</span>g, <span class="s-bold">Protein</span>: <span class="item-protein">${protein}</span>g<br>
                <span class="s-bold">Calories</span>: <span class="item-calories">${calories}</span>
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

// Function to handle the "Submit Diet" button click event
function sendData() {
    // Initialize an empty object to store the diet data
    let dietData = {
        breakfast: [],
        lunch: [],
        snack: [],
        dinner: [],
        'additional-instructions': '',
        BMR: '',
        isEditing: false
    };

    // Read initial BMR input
    const initialBMR = document.getElementById('initialBMR').value;
    dietData.BMR = initialBMR;

    // Read additional instructions input
    const additionalInstructions = document.getElementById('additionalInstructions').value;
    dietData['additional-instructions'] = additionalInstructions;

    // Read breakfast items
    const breakfastItems = readMealItems('breakfast');
    dietData.breakfast = breakfastItems;

    // Read lunch items
    const lunchItems = readMealItems('lunch');
    dietData.lunch = lunchItems;

    // Read snack items
    const snackItems = readMealItems('snack');
    dietData.snack = snackItems;

    // Read dinner items
    const dinnerItems = readMealItems('dinner');
    dietData.dinner = dinnerItems;

    // Display a confirmation dialog
    const confirmSubmit = window.confirm("Are you sure you want to submit this diet?");
    if (confirmSubmit) {
        // Perform the submission action here
        console.log(JSON.stringify(dietData));
        SendDataToFlutter.postMessage(JSON.stringify(dietData));

        // Inform the user that the diet has been submitted (you can replace this with your actual submission logic)
        alert("Your diet has been submitted.");
    }
}

// Function to read meal items for a given section
function readMealItems(section) {
    const mealItems = [];

    // Read meal items from the form
    const itemElements = document.querySelectorAll(`#${section}-list .item`);
    itemElements.forEach((itemElement) => {
        const itemName = itemElement.querySelector('.item-name').textContent;
        const itemQuantity = itemElement.querySelector('.item-quantity').textContent;
        const fat = itemElement.querySelector('.item-fat').textContent;
        const carbs = itemElement.querySelector('.item-carbs').textContent;
        const protein = itemElement.querySelector('.item-protein').textContent;
        const calories = itemElement.querySelector('.item-calories').textContent;

        // Create an object for each meal item
        const mealItem = {
            itemName,
            itemQuantity,
            fat,
            carbs,
            protein,
            calories,
        };

        mealItems.push(mealItem);
    });

    return mealItems;
}


function setData(data) {
    data = JSON.parse(data);

    // Set the initial BMR input value
    const bmrInput = document.getElementById('initialBMR');
    if (data.isEditing) {
        bmrInput.value = data?.BMR || '';
    } else {
        bmrInput.value = data?.gender && data?.weight && data?.height && data?.age ?
            calculateBMR(data) :
            '';
    }


    // Populate breakfast section
    if (data?.breakfast) {
        populateSection('breakfast', data.breakfast);
    }

    // Populate lunch section
    if (data?.lunch) {
        populateSection('lunch', data.lunch);
    }

    // Populate snack section
    if (data?.snack) {
        populateSection('snack', data.snack);
    }

    // Populate dinner section
    if (data?.dinner) {
        populateSection('dinner', data.dinner);
    }

    // Set additional instructions
    const additionalInstructions = document.getElementById('additionalInstructions');
    additionalInstructions.value = data['additional-instructions'] || '';

    // Update the isEditing flag
    dietJSON['isEditing'] = data['isEditing'];
}

function populateSection(section, items) {
    const sectionContainer = document.getElementById(`${section}-list`);
    sectionContainer.innerHTML = ''; // Clear existing items

    if (items && items.length > 0) {
        items.forEach((item) => {
            createUi(section, item.index, item.itemName, item.itemQuantity, item.fat, item.carbs, item.protein, item.calories);
        });
    }
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
    isEditing: false
};


// setData(JSON.stringify(data));