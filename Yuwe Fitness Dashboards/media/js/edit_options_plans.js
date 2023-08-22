export function editDetails(data) {
    const planData = data[Object.keys(data)];
    document.querySelector('#plan-name').value = Object.keys(data);
    document.querySelector('#mode').value = planData['Mode'];
    document.querySelector('#duration').value = planData['Duration'];
    document.querySelector('#diet-update').value = planData['Diet Update'];
    document.querySelector('#counselling').value = planData['Counselling'];
    document.querySelector('#rates').value = planData['Rates'];
    document.querySelector('#offered-price').value = planData['Offered Price'];
    document.querySelector('#full-payment').value = planData['Full Payment'];
}

export function fillForm() {
    document.querySelector('#plan-name').value = 'Basic';
    document.querySelector('#mode').value = 'Upper body';
    document.querySelector('#duration').value = 'Chest, triceps, shoulders';
    document.querySelector('#diet-update').value = 'Shoulder';
    document.querySelector('#counselling').value = 'Compound';
    document.querySelector('#rates').value = 'Bodyweight';
    document.querySelector('#offered-price').value = 'Full body';
    document.querySelector('#full-payment').value = 'Anywhere';
}