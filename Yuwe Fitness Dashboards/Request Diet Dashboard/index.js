document.addEventListener("DOMContentLoaded", function () {
    const dietRequestForm = document.getElementById("dietRequestForm");

    dietRequestForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form inputs
        const height = parseFloat(document.getElementById("height").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const bodyFat = parseFloat(document.getElementById("bodyFat").value);
        const visceralFat = document.getElementById("visceralFat").value;
        const goals = document.getElementById("goals").value;
        const allergies = document.getElementById("allergies").value;
        const medicalConditions = document.getElementById("medicalConditions").value;
        const foodPreferences = document.getElementById("foodPreferences").value;

        // Basic validation (you can add more)
        if (isNaN(height) || isNaN(weight)) {
            alert("Please enter valid height and weight.");
        } else {
            // Submit the form (you can send data to a server here)
            alert("Diet request submitted successfully!");
            dietRequestForm.reset(); // Clear the form
        }
    });
});