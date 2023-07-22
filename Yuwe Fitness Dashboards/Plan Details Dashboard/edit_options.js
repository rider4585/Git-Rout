function editDetails(data) {
    document.querySelector('#plan-name').value = Object.keys(data);
    document.querySelector('#mode').value = data[Object.keys(data)]['Mode'];
    document.querySelector('#duration').value = data[Object.keys(data)]['Duration'];
    document.querySelector('#diet-update').value = data[Object.keys(data)]['Diet Update'];
    document.querySelector('#counselling').value = data[Object.keys(data)]['Counselling'];
    document.querySelector('#rates').value = data[Object.keys(data)]['Rates'];
    document.querySelector('#offered-price').value = data[Object.keys(data)]['Offered Price'];
    document.querySelector('#full-payment').value = data[Object.keys(data)]['Full Payment'];
}

function fillForm() {
    document.querySelector('#plan-name').value = 'Basic';
    document.querySelector('#mode').value = 'Upper body';
    document.querySelector('#duration').value = 'Chest, triceps, shoulders';
    document.querySelector('#diet-update').value = 'Shoulder';
    document.querySelector('#counselling').value = 'Compound';
    document.querySelector('#rates').value = 'Bodyweight';
    document.querySelector('#offered-price').value = 'Full body';
    document.querySelector('#full-payment').value = 'Anywhere';
}