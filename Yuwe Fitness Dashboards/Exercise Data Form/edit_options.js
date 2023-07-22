function editDetails(data) {
    document.querySelector('#exercise-name').value = Object.keys(data);
    document.querySelector('#body-part').value = data[Object.keys(data)]['Body Part'];
    document.querySelector('#muscle-involved').value = data[Object.keys(data)]['Muscle Involved'];
    document.querySelector('#joint-involved').value = data[Object.keys(data)]['Joint Involved'];
    document.querySelector('#exercise-type').value = data[Object.keys(data)]['Type of Exercise'];
    document.querySelector('#equipment-used').value = data[Object.keys(data)]['Equipment Used'];
    document.querySelector('#workout-splits').value = data[Object.keys(data)]['Workout Splits'];
    document.querySelector('#location').value = data[Object.keys(data)]['Location'];
    document.querySelector('#form-and-technique').value = data[Object.keys(data)]['Form and Technique'];
    document.querySelector('#images-link').value = data[Object.keys(data)]['Images Link'];
    document.querySelector('#gif-link').value = data[Object.keys(data)]['GIF Link'];
    document.querySelector('#video-link').value = data[Object.keys(data)]['Video Link'];
    document.querySelector('#benefits').value = data[Object.keys(data)]['Benefits'];
}

function fillForm() {
    document.querySelector('#exercise-name').value = 'Push-up';
    document.querySelector('#body-part').value = 'Upper body';
    document.querySelector('#muscle-involved').value = 'Chest, triceps, shoulders';
    document.querySelector('#joint-involved').value = 'Shoulder';
    document.querySelector('#exercise-type').value = 'Compound';
    document.querySelector('#equipment-used').value = 'Bodyweight';
    document.querySelector('#workout-splits').value = 'Full body';
    document.querySelector('#location').value = 'Anywhere';
    document.querySelector('#form-and-technique').value = 'Start in a plank position with your hands shoulder-width apart. Lower your body until your chest touches the ground, then push back up to the starting position. Keep your core tight and your elbows close to your body.';
    document.querySelector('#images-link').value = 'www.example.com';
    document.querySelector('#gif-link').value = 'www.example.com';
    document.querySelector('#video-link').value = 'www.example.com';
    document.querySelector('#benefits').value = 'Strengthens upper body muscles, Improves core stability';
}