// script.js

function fillDummyData() {
    document.getElementById('name').value = 'John Doe';
    document.getElementById('mid').value = '123456';
    document.getElementById('gender').value = 'male';
    document.getElementById('age').value = '30';
    document.getElementById('height').value = '175';
    document.getElementById('bodyFat').value = '15';
    document.getElementById('visceralFat').value = '10';
    document.getElementById('bmr').value = '1800';
    document.getElementById('bmi').value = '24';
    document.getElementById('bodyAge').value = '28';
    document.getElementById('subcutaneousWholeBody').value = '20';
    document.getElementById('subcutaneousTrunk').value = '15';
    document.getElementById('subcutaneousArm').value = '12';
    document.getElementById('subcutaneousLeg').value = '18';
    document.getElementById('muscleWholeBody').value = '30';
    document.getElementById('muscleTrunk').value = '25';
    document.getElementById('muscleArm').value = '20';
    document.getElementById('muscleLeg').value = '28';
    document.getElementById('chest').value = '95';
    document.getElementById('waist').value = '80';
    document.getElementById('lowerAbs').value = '85';
    document.getElementById('hip').value = '100';
    document.getElementById('thigh').value = '60';
    document.getElementById('calf').value = '40';

    // ... (fill other fields with dummy data)
}

fillDummyData();

function setData(jsonData) {
    const data = JSON.parse(jsonData);

    if (data['personal-information']) {
        const personalInfo = data['personal-information'];
        document.getElementById('name').value = personalInfo.name || '';
        document.getElementById('mid').value = personalInfo.MID || '';
        document.getElementById('gender').value = personalInfo.gender || '';
        document.getElementById('age').value = personalInfo.age || '';
        document.getElementById('height').value = personalInfo.height || '';
    }

    if (data['Body-Fat']) {
        const bodyFat = data['Body-Fat'];
        document.getElementById('bodyFat').value = bodyFat['Body-Fat-Percentage'] || '';
        document.getElementById('visceralFat').value = bodyFat['Visceral-Fat'] || '';
        document.getElementById('bmr').value = bodyFat.BMR || '';
        document.getElementById('bmi').value = bodyFat.BMI || '';
        document.getElementById('bodyAge').value = bodyFat['Body-Age'] || '';
        // ... (set other Body Fat related fields)
    }

    if (data['Subcutaneous-Fat']) {
        const subcutaneousFat = data['Subcutaneous-Fat'];
        document.getElementById('subcutaneousWholeBody').value = subcutaneousFat['Whole-Body'] || '';
        document.getElementById('subcutaneousTrunk').value = subcutaneousFat.Trunk || '';
        document.getElementById('subcutaneousArm').value = subcutaneousFat.Arm || '';
        document.getElementById('subcutaneousLeg').value = subcutaneousFat.Leg || '';
        // ... (set other Subcutaneous Fat related fields)
    }

    if (data['Muscle']) {
        const muscle = data['Muscle'];
        document.getElementById('muscleWholeBody').value = muscle['Whole-Body'] || '';
        document.getElementById('muscleTrunk').value = muscle.Trunk || '';
        document.getElementById('muscleArm').value = muscle.Arm || '';
        document.getElementById('muscleLeg').value = muscle.Leg || '';
        // ... (set other Muscle related fields)
    }

    if (data['Body-Measurement']) {
        const bodyMeasurement = data['Body-Measurement'];
        document.getElementById('chest').value = bodyMeasurement.Chest || '';
        document.getElementById('waist').value = bodyMeasurement.Waist || '';
        document.getElementById('lowerAbs').value = bodyMeasurement['Lower-Abs'] || '';
        document.getElementById('hip').value = bodyMeasurement.Hip || '';
        document.getElementById('thigh').value = bodyMeasurement.Thigh || '';
        document.getElementById('calf').value = bodyMeasurement.Calf || '';
        // ... (set other Body Measurement related fields)
    }
}

function getData() {
    const formData = {
        'personal-information': {
            'name': document.getElementById('name').value,
            'MID': document.getElementById('mid').value,
            'gender': document.getElementById('gender').value,
            'age': document.getElementById('age').value,
            'height': document.getElementById('height').value
        },
        'Body-Fat': {
            'Body-Fat-Percentage': document.getElementById('bodyFat').value,
            'Visceral-Fat': document.getElementById('visceralFat').value,
            'BMR': document.getElementById('bmr').value,
            'BMI': document.getElementById('bmi').value,
            'Body-Age': document.getElementById('bodyAge').value
            // ... (add other Body Fat related fields)
        },
        'Subcutaneous-Fat': {
            'Whole-Body': document.getElementById('subcutaneousWholeBody').value,
            'Trunk': document.getElementById('subcutaneousTrunk').value,
            'Arm': document.getElementById('subcutaneousArm').value,
            'Leg': document.getElementById('subcutaneousLeg').value
            // ... (add other Subcutaneous Fat related fields)
        },
        'Muscle': {
            'Whole-Body': document.getElementById('muscleWholeBody').value,
            'Trunk': document.getElementById('muscleTrunk').value,
            'Arm': document.getElementById('muscleArm').value,
            'Leg': document.getElementById('muscleLeg').value
            // ... (add other Muscle related fields)
        },
        'Body-Measurement': {
            'Chest': document.getElementById('chest').value,
            'Waist': document.getElementById('waist').value,
            'Lower-Abs': document.getElementById('lowerAbs').value,
            'Hip': document.getElementById('hip').value,
            'Thigh': document.getElementById('thigh').value,
            'Calf': document.getElementById('calf').value
            // ... (add other Body Measurement related fields)
        }
    };

    return JSON.stringify(formData);
    // return formData;
}

function isThisYuWeWebPage() {
    return true;
}