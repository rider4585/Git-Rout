function copyToClipboard() {
    //show this only when data is present
    const jsonString = JSON.stringify(exerciseData);
    navigator.clipboard.writeText(jsonString)
        .then(() => {
            console.log('Copied to clipboard:', jsonString);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}

function loadData() {
    //check if user has provided valid json
    exerciseData = JSON.parse(prompt('Paste your data here'));
    createDetailsView(exerciseData);
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