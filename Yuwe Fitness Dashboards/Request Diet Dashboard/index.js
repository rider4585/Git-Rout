const dietRequestForm = document.getElementById("dietRequestForm");

dietRequestForm.addEventListener("submit", function (event) {
    event.preventDefault();
    sendData();
});

function sendData() {
    // Get form inputs
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const bodyFat = parseFloat(document.getElementById("bodyFat").value);
    const visceralFat = document.getElementById("visceralFat").value;
    const goals = document.getElementById("goals").value.split(',').map(item => item.trim());
    const allergies = document.getElementById("allergies").value.split(',').map(item => item.trim());
    const medicalConditions = document.getElementById("medicalConditions").value.split(',').map(item => item.trim());
    const foodPreferences = document.getElementById("foodPreferences").value;

    // Create a JSON object
    const jsonData = {
        height: isNaN(height) ? '' : height,
        weight: isNaN(weight) ? '' : weight,
        bodyFat: isNaN(bodyFat) ? '' : bodyFat,
        visceralFat: visceralFat || '',
        goal: goals.length > 0 ? goals.join(', ') : '',
        allergies: allergies.length > 0 ? allergies : [],
        medicalConditions: medicalConditions.length > 0 ? medicalConditions : [],
        foodPreferences: foodPreferences || ''
    };

    // Log the JSON data (you can send it to a server instead)
    // console.log(jsonData);
    SendDataToFlutter.postMessage(JSON.stringify(jsonData));
}

function isThisYuWeWebPage() {
    return true;
}

function setData(data) {
    // Set values for input fields
    document.getElementById("height").value = data.height || '';
    document.getElementById("weight").value = data.weight || '';
    document.getElementById("bodyFat").value = data.bodyFat || '';
    document.getElementById("visceralFat").value = data.visceralFat || '';
    document.getElementById("goals").value = Array.isArray(data.goal) ? data.goal.join(', ') : '';
    document.getElementById("allergies").value = Array.isArray(data.allergies) ? data.allergies.join(', ') : '';
    document.getElementById("medicalConditions").value = Array.isArray(data.medicalConditions) ? data.medicalConditions.join(', ') : '';

    // Set food preference value and disable if available
    const foodPreferencesSelect = document.getElementById("foodPreferences");
    if (data.foodPreferences) {
        foodPreferencesSelect.value = data.foodPreferences;
    } else {
        foodPreferencesSelect.value = ''; // Set to default (Select Food Preference)
    }

    // Disable input fields if data is found
    if (data.height) {
        document.getElementById("height").disabled = true;
    }
    if (data.weight) {
        document.getElementById("weight").disabled = true;
    }
    if (data.bodyFat) {
        document.getElementById("bodyFat").disabled = true;
    }
    if (data.visceralFat) {
        document.getElementById("visceralFat").disabled = true;
    }
}


let DummyData = {
    height: 175, // Example height value
    weight: 70, // Example weight value
    bodyFat: 15.5, // Example body fat value
    visceralFat: 'Moderate', // Example visceral fat value
    goal: ['Lose weight', 'Shred'], // Example goal value
    allergies: ['Peanuts', 'Dairy'], // Example allergies array
    medicalConditions: ['Hypertension', 'Diabetes'], // Example medical conditions array
    foodPreferences: 'N' // Example food preference value
};
// Example usage
// setData(DummyData);