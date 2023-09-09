// document.getElementById("full-name").value = 'Raviraj';
// document.getElementById("email").value = 'ravi@gmail.com';
// document.getElementById("mobile").value = '7798476162';
// document.getElementById("birth-date").value = '24-10-1999';
// document.getElementById("address").value = 'iuhe';
// document.getElementById('gender').value = 'Male'
// document.getElementById('blood-group').value = 'AB+'
// document.getElementById('marital-status').value = 'Married';

// let interested = ['Zumba', 'Yoga', 'Full Body', 'Habit Building', '12 Week Transformation'];

// let goalsArray = document.querySelector('#interests');
// let goalsInnerHtml = '';

function loadInterests(interested) {

    for (const element of interested) {
        goalsInnerHtml += `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="interest-${element}" name="interest[]" value="${element}">
                            <label class="form-check-label" for="interest-${element}">
                                ${element}
                            </label>
                        </div>`;
    };

    goalsArray.innerHTML = goalsInnerHtml;
}

// loadInterests(interested);