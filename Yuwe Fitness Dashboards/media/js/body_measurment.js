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

// fillDummyData();

function setData(jsonData) {
    const data = jsonData;

    // Personal Information
    if (data['personal-information']) {
        const personalInfo = data['personal-information'];
        const nameInput = document.getElementById('name');
        const midInput = document.getElementById('mid');
        const genderInput = document.getElementById('gender');
        const ageInput = document.getElementById('age');
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');

        if (personalInfo.name && personalInfo.name !== '') {
            nameInput.value = personalInfo.name;
            nameInput.disabled = true;
        }

        if (personalInfo.MID && personalInfo.MID !== '') {
            midInput.value = personalInfo.MID;
            midInput.disabled = true;
        }

        if (personalInfo.gender && personalInfo.gender !== '') {
            genderInput.value = personalInfo.gender;
            genderInput.disabled = true;
        }

        if (personalInfo.age && personalInfo.age !== '') {
            ageInput.value = personalInfo.age;
            ageInput.disabled = true;
        }

        if (personalInfo.height && personalInfo.height !== '') {
            heightInput.value = personalInfo.height;
            heightInput.disabled = true;
        }

        if (personalInfo.weight && personalInfo.weight !== '') {
            weightInput.value = personalInfo.weight;
            weightInput.disabled = true;
        }
    }

    // Body Fat Section
    if (data['Body-Fat']) {
        const bodyFat = data['Body-Fat'];
        const bodyFatInput = document.getElementById('bodyFat');
        const visceralFatInput = document.getElementById('visceralFat');
        const bmrInput = document.getElementById('bmr');
        const bmiInput = document.getElementById('bmi');
        const bodyAgeInput = document.getElementById('bodyAge');

        if (bodyFat['Body-Fat-Percentage'] && bodyFat['Body-Fat-Percentage'] !== '') {
            bodyFatInput.value = bodyFat['Body-Fat-Percentage'];
            bodyFatInput.disabled = true;
        }

        if (bodyFat['Visceral-Fat'] && bodyFat['Visceral-Fat'] !== '') {
            visceralFatInput.value = bodyFat['Visceral-Fat'];
            visceralFatInput.disabled = true;
        }

        if (bodyFat.BMR && bodyFat.BMR !== '') {
            bmrInput.value = bodyFat.BMR;
            bmrInput.disabled = true;
        }

        if (bodyFat.BMI && bodyFat.BMI !== '') {
            bmiInput.value = bodyFat.BMI;
            bmiInput.disabled = true;
        }

        if (bodyFat['Body-Age'] && bodyFat['Body-Age'] !== '') {
            bodyAgeInput.value = bodyFat['Body-Age'];
            bodyAgeInput.disabled = true;
        }
    }

    // Repeat the same pattern for other sections (Subcutaneous Fat, Muscle, Body Measurement)

    // Subcutaneous Fat Section
    if (data['Subcutaneous-Fat']) {
        const subcutaneousFat = data['Subcutaneous-Fat'];
        const subcutaneousWholeBodyInput = document.getElementById('subcutaneousWholeBody');
        const subcutaneousTrunkInput = document.getElementById('subcutaneousTrunk');
        const subcutaneousArmInput = document.getElementById('subcutaneousArm');
        const subcutaneousLegInput = document.getElementById('subcutaneousLeg');

        if (subcutaneousFat['Whole-Body'] && subcutaneousFat['Whole-Body'] !== '') {
            subcutaneousWholeBodyInput.value = subcutaneousFat['Whole-Body'];
            subcutaneousWholeBodyInput.disabled = true;
        }

        if (subcutaneousFat.Trunk && subcutaneousFat.Trunk !== '') {
            subcutaneousTrunkInput.value = subcutaneousFat.Trunk;
            subcutaneousTrunkInput.disabled = true;
        }

        if (subcutaneousFat.Arm && subcutaneousFat.Arm !== '') {
            subcutaneousArmInput.value = subcutaneousFat.Arm;
            subcutaneousArmInput.disabled = true;
        }

        if (subcutaneousFat.Leg && subcutaneousFat.Leg !== '') {
            subcutaneousLegInput.value = subcutaneousFat.Leg;
            subcutaneousLegInput.disabled = true;
        }
    }

    // Muscle Section
    if (data['Muscle']) {
        const muscle = data['Muscle'];
        const muscleWholeBodyInput = document.getElementById('muscleWholeBody');
        const muscleTrunkInput = document.getElementById('muscleTrunk');
        const muscleArmInput = document.getElementById('muscleArm');
        const muscleLegInput = document.getElementById('muscleLeg');

        if (muscle['Whole-Body'] && muscle['Whole-Body'] !== '') {
            muscleWholeBodyInput.value = muscle['Whole-Body'];
            muscleWholeBodyInput.disabled = true;
        }

        if (muscle.Trunk && muscle.Trunk !== '') {
            muscleTrunkInput.value = muscle.Trunk;
            muscleTrunkInput.disabled = true;
        }

        if (muscle.Arm && muscle.Arm !== '') {
            muscleArmInput.value = muscle.Arm;
            muscleArmInput.disabled = true;
        }

        if (muscle.Leg && muscle.Leg !== '') {
            muscleLegInput.value = muscle.Leg;
            muscleLegInput.disabled = true;
        }
    }

    // Body Measurement Section
    if (data['Body-Measurement']) {
        const bodyMeasurement = data['Body-Measurement'];
        const chestInput = document.getElementById('chest');
        const waistInput = document.getElementById('waist');
        const lowerAbsInput = document.getElementById('lowerAbs');
        const hipInput = document.getElementById('hip');
        const thighInput = document.getElementById('thigh');
        const calfInput = document.getElementById('calf');
        const armInput = document.getElementById('arm');

        if (bodyMeasurement.Chest && bodyMeasurement.Chest !== '') {
            chestInput.value = bodyMeasurement.Chest;
            chestInput.disabled = true;
        }

        if (bodyMeasurement.Waist && bodyMeasurement.Waist !== '') {
            waistInput.value = bodyMeasurement.Waist;
            waistInput.disabled = true;
        }

        if (bodyMeasurement['Lower-Abs'] && bodyMeasurement['Lower-Abs'] !== '') {
            lowerAbsInput.value = bodyMeasurement['Lower-Abs'];
            lowerAbsInput.disabled = true;
        }

        if (bodyMeasurement.Hip && bodyMeasurement.Hip !== '') {
            hipInput.value = bodyMeasurement.Hip;
            hipInput.disabled = true;
        }

        if (bodyMeasurement.Thigh && bodyMeasurement.Thigh !== '') {
            thighInput.value = bodyMeasurement.Thigh;
            thighInput.disabled = true;
        }

        if (bodyMeasurement.Calf && bodyMeasurement.Calf !== '') {
            calfInput.value = bodyMeasurement.Calf;
            calfInput.disabled = true;
        }

        if (bodyMeasurement.Arm && bodyMeasurement.Arm !== '') {
            armInput.value = bodyMeasurement.Arm;
            armInput.disabled = true;
        }
    }
}


function sendData() {
    const formData = {
        'personal-information': {
            'name': document.getElementById('name').value,
            'MID': document.getElementById('mid').value,
            'gender': document.getElementById('gender').value,
            'age': document.getElementById('age').value,
            'height': document.getElementById('height').value,
            'weight': document.getElementById('weight').value
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

    // console.log(JSON.stringify(formData));
    SendDataToFlutter.postMessage(JSON.stringify(formData));
    // return JSON.stringify(formData);
    // return formData;
}

function isThisYuWeWebPage() {
    return true;
}

let dummyData = {
    "personal-information": {
        "name": "John Doe",
        "MID": "123456",
        "gender": "male",
        "age": "30",
        "height": "175",
        "weight": "70"
    },
    "Body-Fat": {
        "Body-Fat-Percentage": "15",
        "Visceral-Fat": "10",
        "BMR": "1800",
        "BMI": "24",
        "Body-Age": "28"
    },
    "Subcutaneous-Fat": {
        "Whole-Body": "20",
        "Trunk": "15",
        "Arm": "12",
        "Leg": "18"
    },
    "Muscle": {
        "Whole-Body": "30",
        "Trunk": "25",
        "Arm": "20",
        "Leg": "28"
    },
    "Body-Measurement": {
        "Chest": "95",
        "Waist": "80",
        "Lower-Abs": "85",
        "Hip": "100",
        "Thigh": "60",
        "Calf": "40",
        "Arm": "30"
    }
};

setData(dummyData);