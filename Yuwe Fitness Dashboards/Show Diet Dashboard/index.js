// Sample JSON data for testing
// const jsonData = {
//     "name": "John Doe",
//     "gender": "Male",
//     "weight": 70,
//     "goal": "Muscle Gain",
//     "bmr": 1600,
//     "height": "175 cm",
//     "age": 30,
//     "tableData": {
//         "breakfast": [{
//                 "index": 0,
//                 "itemName": "Scrambled Eggs",
//                 "itemQuantity": "2 eggs",
//                 "fat": "10g",
//                 "carbs": "2g",
//                 "protein": "12g",
//                 "calories": "150"
//             },
//             {
//                 "index": 1,
//                 "itemName": "Greek Yogurt",
//                 "itemQuantity": "1 cup",
//                 "fat": "2g",
//                 "carbs": "6g",
//                 "protein": "10g",
//                 "calories": "120"
//             }
//         ],
//         "lunch": [{
//                 "index": 0,
//                 "itemName": "Grilled Chicken Breast",
//                 "itemQuantity": "4 oz",
//                 "fat": "2g",
//                 "carbs": "0g",
//                 "protein": "30g",
//                 "calories": "150"
//             },
//             {
//                 "index": 1,
//                 "itemName": "Quinoa Salad",
//                 "itemQuantity": "1 cup",
//                 "fat": "4g",
//                 "carbs": "30g",
//                 "protein": "8g",
//                 "calories": "200"
//             }
//         ],
//         "snack": [{
//                 "index": 0,
//                 "itemName": "Almonds",
//                 "itemQuantity": "1 oz",
//                 "fat": "14g",
//                 "carbs": "3g",
//                 "protein": "6g",
//                 "calories": "160"
//             },
//             {
//                 "index": 1,
//                 "itemName": "Cucumber Slices",
//                 "itemQuantity": "1 cup",
//                 "fat": "0g",
//                 "carbs": "2g",
//                 "protein": "1g",
//                 "calories": "15"
//             }
//         ],
//         "dinner": [{
//                 "index": 0,
//                 "itemName": "Baked Salmon",
//                 "itemQuantity": "6 oz",
//                 "fat": "12g",
//                 "carbs": "0g",
//                 "protein": "36g",
//                 "calories": "300"
//             },
//             {
//                 "index": 1,
//                 "itemName": "Steamed Asparagus",
//                 "itemQuantity": "1 cup",
//                 "fat": "0g",
//                 "carbs": "3g",
//                 "protein": "2g",
//                 "calories": "20"
//             }
//         ],
//         "additional-instructions": "Drink 4-5 liters water daily, without fail - NO COMPROMISE ON THIS"
//     }
// };

// Function to populate the form and calculate total macros
function setData(data) {
    // Extract meal data and additional instructions
    let tableRows = ['breakfast', 'lunch', 'snack', 'dinner'].filter(meal => data.tableData[meal].length > 0);
    let additionalDataColumn = data.tableData["additional-instructions"];

    // Populate personal information
    document.getElementById("name").textContent = data.name;
    document.getElementById("gender").textContent = data.gender;
    document.getElementById("weight").textContent = data.weight + " Kg";
    document.getElementById("goal").textContent = data.goal;
    document.getElementById("bmr").textContent = data.bmr;
    document.getElementById("height").textContent = data.height;
    document.getElementById("age").textContent = data.age;

    let mealItems = document.getElementById("meal-items");
    let totalItems = 0;

    // Loop through meal categories and create sections
    tableRows.forEach(mealCategory => {
        let mealData = data.tableData[mealCategory];
        let row = document.createElement("tr");

        // Create a colspan for the meal category
        let cell = document.createElement("td");
        cell.innerHTML = `<strong>${mealCategory.charAt(0).toUpperCase() + mealCategory.slice(1)}</strong>`;
        cell.setAttribute("colspan", "6");
        row.appendChild(cell);

        mealItems.appendChild(row);

        // Populate table rows with meal data
        mealData.forEach(item => {
            let row = document.createElement("tr");

            cell = document.createElement("td");
            cell.textContent = item.itemName;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.textContent = item.itemQuantity;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.textContent = item.fat;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.textContent = item.carbs;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.textContent = item.protein;
            row.appendChild(cell);

            cell = document.createElement("td");
            cell.textContent = item.calories;
            row.appendChild(cell);

            mealItems.appendChild(row);
            totalItems++;
        });
    });

    // Populate additional data column and set rowspan
    let additionalDataCell = document.createElement("td");
    additionalDataCell.textContent = additionalDataColumn;
    additionalDataCell.setAttribute("rowspan", tableRows.length + totalItems + 1);
    mealItems.querySelector("tr:first-child").appendChild(additionalDataCell);

    // Calculate and update total macros
    let totalMacrosRow = document.createElement("tr");
    totalMacrosRow.innerHTML = `
        <td colspan="2"><strong>Total Macros</strong></td>
        <td><strong id="total-fat">Sum of Fats</strong></td>
        <td><strong id="total-carbs">Sum of Carbs</strong></td>
        <td><strong id="total-protein">Sum of Protein</strong></td>
        <td><strong id="total-calories">Sum of Calories</strong></td>
    `;

    mealItems.appendChild(totalMacrosRow);

    let totalFat = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalCalories = 0;

    // Loop through meal categories and items in JSON data
    tableRows.forEach(mealCategory => {
        let mealData = data.tableData[mealCategory];
        mealData.forEach(item => {
            totalFat += parseFloat(item.fat);
            totalCarbs += parseFloat(item.carbs);
            totalProtein += parseFloat(item.protein);
            totalCalories += parseFloat(item.calories);
        });
    });

    document.getElementById("total-fat").textContent = totalFat.toFixed(2);
    document.getElementById("total-carbs").textContent = totalCarbs.toFixed(2);
    document.getElementById("total-protein").textContent = totalProtein.toFixed(2);
    document.getElementById("total-calories").textContent = totalCalories.toFixed(2);
}

// Call the setData function with your JSON data
// setData(jsonData);