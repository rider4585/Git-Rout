// Get references to the input fields
const memberId = document.getElementById('memberId');
const name = document.getElementById('name');
const phoneNumber = document.getElementById('phoneNumber');
const email = document.getElementById('email');
const date = document.getElementById('date');
const invoiceNo = document.getElementById('invoiceNo');
const gstNo = document.getElementById('gstNo');
const sacNo = document.getElementById('sacNo');
const place = document.getElementById('place');
const state = document.getElementById('state');
const plan = document.getElementById('plan');
const instructor = document.getElementById('instructor');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const courseFee = document.getElementById('courseFee');
const amountInWords = document.getElementById('amountInWords');
const discount = document.getElementById('discount');
const discountedFee = document.getElementById('discountedFee');
const memberGST = document.getElementById('memberGST');
const paymentAmount = document.getElementById("paymentAmount");
const registrationFee = document.getElementById("registrationFee");
const cgst = document.getElementById("cgst");
const sgst = document.getElementById("sgst");
const igst = document.getElementById("igst");
const total = document.getElementById("total");
const paid = document.getElementById("paid");
const balance = document.getElementById("balance");

function isThisYuWeWebPage() {
    return true;
}

let maximumDiscountedPrice = '';

function setData(dummyData, date, plans_data) {
    // Set the date field to the provided date
    const dateInput = document.getElementById('date');
    dateInput.value = date;

    for (const section in dummyData) {
        for (const key in dummyData[section]) {
            const inputField = document.getElementById(key);
            if (inputField) {
                inputField.value = dummyData[section][key];
            }
        }
    }

    createCourseDropdown(plans_data);
}

function createCourseDropdown(plans_data) {
    // Get a reference to the select element
    const planSelect = document.getElementById('plan');

    // Create and add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Set the value to an empty string or any other value you prefer
    defaultOption.textContent = 'Select a Plan';
    defaultOption.disabled = true; // Make it non-selectable
    defaultOption.selected = true; // Make it the default selected option
    planSelect.appendChild(defaultOption);

    // Iterate over your plans_data and add options to the select element
    for (const planName in plans_data) {
        const option = document.createElement('option');
        option.value = planName;
        option.textContent = planName;
        planSelect.appendChild(option);
    }

    planSelect.addEventListener('change', changeCourseData);
}

function changeCourseData() {
    const planSelect = document.getElementById('plan');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const planFee = document.getElementById('courseFee');
    const planFeeInWords = document.getElementById('amountInWords');
    const selectedPlan = planSelect.value;

    if (selectedPlan in plans_data) {

        // Get today's date
        const today = new Date();

        // Calculate days until the next Monday
        let daysUntilMonday = 1 - today.getDay(); // 1 = Monday, 0 = Sunday, 6 = Saturday

        if (daysUntilMonday <= 0) {
            daysUntilMonday += 7; // If today is Monday or later, add days to get to the next Monday
        }

        // Calculate the date of the next Monday
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilMonday);

        // Format the date as 'YYYY-MM-DD'
        const nextMondayFormatted = nextMonday.toISOString().split('T')[0];

        startDateInput.value = nextMondayFormatted;

        const courseData = plans_data[selectedPlan];
        const durationDays = courseData.durationDays;

        // Calculate the end date
        const startDate = new Date(startDateInput.value);
        let endDate = new Date(startDate);
        const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

        for (let i = 0; i < durationDays; i++) {
            endDate = new Date(endDate.getTime() + oneDay);
            // Skip Fridays (day 5) and Sundays (day 0)
            if (endDate.getDay() === 5 || endDate.getDay() === 0) {
                i--;
            }
        }

        // Format the end date as "YYYY-MM-DD"
        const dd = String(endDate.getDate()).padStart(2, '0');
        const mm = String(endDate.getMonth() + 1).padStart(2, '0');
        const yyyy = endDate.getFullYear();
        const formattedEndDate = `${yyyy}-${mm}-${dd}`;

        endDateInput.value = formattedEndDate;

        planFee.value = courseData.price;
        const amountInWords = numberToWords.toWords(courseData.price);
        planFeeInWords.value = amountInWords;
        maximumDiscountedPrice = courseData.maxDiscountPrice;
        enableFields();
    }
}

function enableFields() {
    let fieldsToEnable = [instructor, discount, memberGST, paymentAmount];
    fieldsToEnable.forEach(field => {
        field.removeAttribute('disabled');
    });
}

// Add an event listener to the "Payment Amount" field
discount.addEventListener("input", function () {
    const courseFeeAmount = parseFloat(courseFee.value) || 0;

    if (discount.value == '') {
        discountedFee.value = '';
        return;
    }

    // Calculate Discount as a percentage
    let discountPercentage = parseFloat(discount.value) || 0;
    if (discountPercentage) {
        discountPercentage = (courseFeeAmount * discountPercentage) / 100;
        console.log(discountPercentage);
    }

    // Ensure discount is not less than maximumDiscountedPrice
    if (discountPercentage > 0 && courseFeeAmount - discountPercentage < parseFloat(maximumDiscountedPrice)) {
        discount.value = '';
        discountedFee.value = '';
        alert("Too much discount");
        return;
    }

    discountedFee.value = courseFeeAmount - discountPercentage;
});

paymentAmount.addEventListener("input", function () {

    if (Number(paymentAmount.value) > Number(discountedFee.value)) {
        paymentAmount.value = '';
        cgst.value = '';
        sgst.value = '';
        igst.value = '';
        total.value = '';
        paid.value = '';
        balance.value = '';
        alert('Payment amount is greater that course fees.');
        return;
    }

    // Calculate CGST and SGST
    const cgstAmount = (paymentAmount.value * 0.09).toFixed(2);
    cgst.value = cgstAmount;
    sgst.value = cgstAmount;

    // Calculate IGST
    const igstAmount = (paymentAmount.value * 0.00).toFixed(2);
    igst.value = igstAmount;

    // Calculate Total
    const totalAmount = Number(paymentAmount.value) + Number(cgstAmount) + Number(cgstAmount) + Number(igstAmount);
    total.value = totalAmount;

    // Calculate Balance
    const balanceAmount = (discountedFee.value - totalAmount).toFixed(2);
    balance.value = balanceAmount;
})


// Example of how to use setData with dummy data and a date
const dummyData = {
    personalInfo: {
        memberId: '12345',
        name: 'John Doe',
        phoneNumber: '1234567890',
        email: 'johndoe@example.com',
        invoiceNo: 'INV123',
        gstNo: 'GST12345',
        sacNo: 'SAC6789',
        place: 'Pune',
        state: 'Maharashtra',
    },
    enrollmentInfo: {
        instructor: 'Jane Smith',
    },
};

// Set the date separately
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
const formattedDate = `${yyyy}-${mm}-${dd}`;

let plans_data = {
    " 12 Weeks Body Transformation Challenge (Online) basic": {
        "benefits": "Tailored fitness and nutrition plan\nVirtual support network\nFlexibility to join from anywhere\nProven results-driven approach\nExpert guidance for sustainable change",
        "counselling": 12,
        "description": "Embark on your online fitness journey! Join our 12 Weeks Body Transformation Challenge for personalized workouts, expert nutrition guidance, and a supportive virtual community. Achieve your fitness goals from anywhere.",
        "dietUpdate": 3,
        "durationDays": 83,
        "durationWeeks": 12,
        "maxDiscountPrice": "4999.00",
        "mode": "online",
        "price": "8000.00"
    },
    "12 Weeks Body Transformation Challenge (Offline):": {
        "benefits": "Personalized in-person coaching\nAccess to exclusive resources\nPremium fitness environment\nReal-time feedback and support\nVisible, life-changing results",
        "counselling": 12,
        "description": "Experience the ultimate fitness transformation offline! Our premium 12 Weeks Body Transformation Challenge offers personalized, in-person training, exclusive resources, and a premium fitness experience.",
        "dietUpdate": 3,
        "durationDays": 90,
        "durationWeeks": 12,
        "maxDiscountPrice": "14999.00",
        "mode": "offline",
        "price": "20000.00"
    },
    "21 Days Habit Building Challenge": {
        "benefits": "Develop lasting positive habits\nIncreased discipline and self-control\nAccess from anywhere\nConnect with a diverse global community\nExpert guidance for your journey",
        "counselling": 4,
        "description": "Transform your life online! Join our 21 Days Habit Building Challenge for convenient, flexible, and affordable habit transformation. Be part of a global community and get expert guidance from the comfort of your home.",
        "dietUpdate": 1,
        "durationDays": 28,
        "durationWeeks": 4,
        "maxDiscountPrice": "1999.00",
        "mode": "online",
        "price": "4000.00"
    },
    "21 Days Habit Building Challenge (Offline)": {
        "benefits": "Personalized in-person coaching\nExclusive resources and materials\nPremium, supportive community\nReal, meaningful connections\nAccelerated habit formation",
        "counselling": 4,
        "description": "Elevate your transformation journey with our premium Offline 21 Days Habit Building Challenge. Experience in-person support, tailored guidance, and exclusive resources. Forge real connections with trainers and peers.",
        "dietUpdate": 1,
        "durationDays": 28,
        "durationWeeks": 4,
        "maxDiscountPrice": "3999.00",
        "mode": "offline",
        "price": "6000.00"
    },
    "Yoga 20 Sessions Live (Online):": {
        "benefits": "Enhanced physical and mental well-being\nExpert-led sessions from home\nIncreased flexibility and strength\nConvenient virtual sessions\nStress reduction and mindfulness",
        "counselling": 3,
        "description": "Discover peace, flexibility, and strength with our 20 Sessions of Live Yoga online. Join from anywhere, access expert instructors, and enjoy the convenience of virtual yoga. Experience holistic wellness at your fingertips.",
        "dietUpdate": 0,
        "durationDays": 28,
        "durationWeeks": 4,
        "maxDiscountPrice": "1999.00",
        "mode": "online",
        "price": "4000.00"
    },
    "diet plan": {
        "benefits": "Customized nutrition for your goals\nExpert guidance from certified nutritionists\nEnjoyable and varied meal options\nEnhanced fitness results with aligned diet\nOngoing support and accountability\nImproved overall health and energy",
        "counselling": 1,
        "description": "Achieve your health and fitness goals with our Personalized Diet Plan Service. Our experienced nutritionists will create a tailored meal plan that aligns with your unique needs and objectives.",
        "dietUpdate": 1,
        "durationDays": 0,
        "durationWeeks": 0,
        "maxDiscountPrice": "999.00",
        "mode": "online",
        "price": "2500.00"
    }
}

// Call the setData function with the dummy data and date
setData(dummyData, formattedDate, plans_data);