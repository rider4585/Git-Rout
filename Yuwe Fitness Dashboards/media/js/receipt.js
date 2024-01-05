// Get references to the input fields
const receiptForm = document.getElementById('receiptForm');
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
const includeGST = document.getElementById('includeGST');
const excludeGST = document.getElementById('excludeGST');
const gstOption = document.querySelectorAll('input[name="gstOption"]');
const total = document.getElementById("total");
const paid = document.getElementById("paid");
const balance = document.getElementById("balance");

let maximumDiscountedPrice = '';
let discountedCourseFees = '';
let courseFeeWithoutGst = '';
let courseFeeWithGst = '';
let maxDiscountedAllowed = '';
let selectedCourse = '';
let selectedCourseDuration = '';
let remainingAmount = 0;
let paidAmount = 0;
let isNew = true;

function setData(data) {
    date.value = getDate();
    isNew = data.isNew;
    createCourseDropdown(data.plansData);

    // Set the date field to the provided date
    // if (!data.isPrint) {
    // }

    for (const section in data) {
        for (const key in data[section]) {
            const inputField = document.getElementById(key);
            if (inputField) {
                // console.log(inputField);
                inputField.value = data[section][key];
                if (inputField.classList.contains('personal-info')) {
                    inputField.setAttribute('readonly', 'true');
                }
                if (inputField.classList.contains('rupee')) {
                    inputField.value = toggleRupeeSign(data[section][key], 'add');
                }
            }
            if (!data.isNew) {
                if (key == "courseName") {
                    plan.value = data[section][key];
                    plan.setAttribute('disabled', 'true');
                }

                if (key == "gstOption") {
                    document.getElementById(data[section][key]).checked = true;
                }

                if (key == "balance") {
                    remainingAmount = data[section][key];
                }

            }
        }
    }

    if (!data.isNew) {
        paymentAmount.removeAttribute("disabled");
        paymentAmount.value = '';
        paid.value = data["enrollmentInfo"]["paymentAmount"];
    }
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

    planSelect.addEventListener('change', () => {
        changeSelectedCourse(plans_data)
    });
}

function changeSelectedCourse(plans_data) {
    const planSelect = document.getElementById('plan');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const planFee = document.getElementById('courseFee');
    const planFeeInWords = document.getElementById('amountInWords');
    const selectedPlan = planSelect.value;
    maximumDiscountedPrice = '';
    courseFeeWithoutGst = '';
    courseFeeWithGst = '';
    maxDiscountedAllowed = '';

    if (selectedPlan in plans_data) {
        const courseDataObject = plans_data[selectedPlan];
        selectedCourse = selectedPlan;
        selectedCourseDuration = courseDataObject.durationWeeks;

        instructor.value = '';
        startDate.value = '';
        endDate.value = '';
        amountInWords.value = '';
        discount.value = '0';
        discountedFee.value = `${courseDataObject.price} ₹`;
        memberGST.value = '';
        paymentAmount.value = '';
        registrationFee.value = '0 ₹';
        cgst.value = '';
        sgst.value = '';
        igst.value = '';
        gstOption.forEach(option => {
            option.checked = false;
        });
        total.value = '';
        paid.value = '';
        balance.value = '';

        instructor.value = dummyData['enrollmentInfo']['instructor'];
        // let courseStartDate = calculateCourseStartDate();
        // startDateInput.value = courseStartDate;

        // endDateInput.value = calculateCourseEndDate(courseStartDate, durationWeeks);

        planFee.value = `${courseDataObject.price} ₹`;
        const newAmountInWords = `${numberToWords.toWords(courseDataObject.price)} rupee`;
        planFeeInWords.value = newAmountInWords;
        maximumDiscountedPrice = courseDataObject.maxDiscountPrice;
        discountedCourseFees = courseDataObject.price;
        courseFeeWithoutGst = Number(courseDataObject.price);
        courseFeeWithGst = (courseFeeWithoutGst * 18 / 100) + (courseFeeWithoutGst);
        maxDiscountedAllowed = courseDataObject.price - courseDataObject.maxDiscountPrice;
        enableFields();
    }
}

function calculateCourseStartDate() {
    // Get today's date
    const today = new Date();

    if (today.getDay() === 1) {
        // If today is Monday, use today's date
        return formatDateToYYYYMMDD(today);
    } else {
        // Calculate days until the next Monday
        let daysUntilMonday = 1 - today.getDay(); // 1 = Monday, 0 = Sunday, 6 = Saturday

        if (daysUntilMonday <= 0) {
            daysUntilMonday += 7; // If today is Monday or later, add days to get to the next Monday
        }

        // Calculate the date of the next Monday
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilMonday);

        // Format the date as 'YYYY-MM-DD'
        return formatDateToYYYYMMDD(nextMonday);
    }
}

function calculateCourseEndDate(courseStartDate, durationWeeks) {
    // Calculate the end date as a specific number of weeks after the start date
    const newStartDate = new Date(courseStartDate);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + durationWeeks * 7); // 7 days in a week

    // Format the end date as "YYYY-MM-DD"
    const dd = String(newEndDate.getDate()).padStart(2, '0');
    const mm = String(newEndDate.getMonth() + 1).padStart(2, '0');
    const yyyy = newEndDate.getFullYear();
    const formattedEndDate = `${yyyy}-${mm}-${dd}`;
    return formattedEndDate;
}

function enableFields() {
    let fieldsToEnable = [startDate, instructor, discount, memberGST, paymentAmount, includeGST, excludeGST];
    fieldsToEnable.forEach(field => {
        field.removeAttribute('disabled');
    });
}

function isThisYuWeWebPage() {
    return true;
}

gstOption.forEach(option => {
    option.addEventListener("change", () => {
        calculateAmounts();
    })
});

// Add an event listener to the "Discount" field
discount.addEventListener("input", function () {
    const courseFeeAmount = parseFloat(courseFee.value) || 0;
    const maxDiscountedAmount = parseFloat(maximumDiscountedPrice);

    // discount.value = '';
    // discountedFee.value = '';
    paymentAmount.value = '';
    registrationFee.value = '0 ₹';
    cgst.value = '';
    sgst.value = '';
    igst.value = '';
    gstOption.forEach(option => {
        option.checked = false;
    });
    total.value = '';
    paid.value = '';
    balance.value = '';

    if (discount.value == '') {
        discountedFee.value = `${Number(courseFee.value.split(' ')[0]).toFixed(2)} ₹`;
        discountedCourseFees = Number(courseFee.value.split(' ')[0]).toFixed(2);
        return;
    }

    // Get the entered discount amount
    const discountAmount = parseFloat(discount.value) || 0;
    const totalDiscountedPrice = courseFeeAmount - discountAmount;

    // Ensure discount is not less than maximumDiscountedPrice
    if (discountAmount < 0 || totalDiscountedPrice < maxDiscountedAmount) {
        discount.value = 0;
        discountedFee.value = courseFee.value;
        discountedCourseFees = Number(courseFee.value.split(' ')[0]).toFixed(2);
        alert("Discount cannot be less than the maximum discounted price.");
        return;
    }

    let newPaymentAmount = Number(paymentAmount.value);
    if (newPaymentAmount) {
        const selectedGstOption = document.querySelector('input[name="gstOption"]:checked');
        if (selectedGstOption && selectedGstOption.value === 'include') {
            total.value = `${courseFeeWithoutGst - newPaymentAmount} ₹`;
        }
        if (selectedGstOption && selectedGstOption.value === 'exclude') {
            total.value = `${courseFeeWithGst - newPaymentAmount} ₹`;
        }
    }

    // Calculate the discounted fee
    const discountedAmount = courseFeeAmount - discountAmount;
    discountedFee.value = `${discountedAmount} ₹`;
    discountedCourseFees = discountedAmount;

    courseFeeWithoutGst = discountedAmount;
    courseFeeWithGst = (discountedAmount * 18 / 100) + discountedAmount;

    let balanceAmount = Number(balance.value.split(' ')[0]);
    if (balanceAmount) {
        const selectedGstOption = document.querySelector('input[name="gstOption"]:checked').value;
        let discountedPriceAmount = Number(discountedFee.value.split(' ')[0]);
        let balanceAmount = '';

        if (selectedGstOption === 'include') {
            total.value = Number(paymentAmount.value);
            if (discountedPriceAmount) {
                balanceAmount = discountedPriceAmount - Number(paymentAmount.value);
            } else {
                balanceAmount = courseFeeWithoutGst - Number(paymentAmount.value);
            }
        }

        if (selectedGstOption === 'exclude') {
            total.value = Number(paymentAmount.value) + Number(cgst.value) + Number(sgst.value);
            if (discountedPriceAmount) {
                balanceAmount = discountedPriceAmount - Number(paymentAmount.value);
            } else {
                balanceAmount = courseFeeWithGst - Number(paymentAmount.value);
            }
        }

        balance.value = `${balanceAmount} ₹`;
    }
});

startDate.addEventListener('focusout', () => {
    if (isNew) {
        if (startDate.value !== '') {
            const inputDate = new Date(startDate.value);

            if (!isNaN(inputDate.getTime())) {
                endDate.value = calculateCourseEndDate(startDate.value, selectedCourseDuration);
            } else {
                startDate.value = '';
                alert('Please enter a valid date in the format YYYY-MM-DD');
            }
        } else {
            startDate.value = '';
            alert('Please enter a valid date in the format YYYY-MM-DD');
        }
    }
});


function formatDateToYYYYMMDD(timeString) {
    const date = new Date(timeString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

paymentAmount.addEventListener("input", function () {
    const discountedAmount = parseFloat(discountedFee.value) || 0;
    registrationFee.value = '0 ₹';
    cgst.value = '';
    sgst.value = '';
    igst.value = '';
    total.value = '';
    if (isNew) {
        paid.value = '';
    }
    // if (isNew) {
    //     gstOption.forEach(option => {
    //         option.checked = false;
    //     });
    // }
    balance.value = '';
    if (Number(paymentAmount.value) > discountedAmount) {
        paymentAmount.value = '';
        alert('Payment amount is greater than the discounted fee.');
        return;
    }

    // Calculate CGST and SGST
    const cgstAmount = (paymentAmount.value * 0.09).toFixed(2);
    cgst.value = cgstAmount;
    sgst.value = cgstAmount;
    courseFeeWithoutGst = paymentAmount.value;
    courseFeeWithGst = Number(paymentAmount.value) + (cgstAmount * 2);

    // Calculate IGST
    const igstAmount = (paymentAmount.value * 0.00).toFixed(2);
    igst.value = igstAmount;

    calculateAmounts();
});

function calculateAmounts() {

    const selectedGstOption = document.querySelector('input[name="gstOption"]:checked').value;
    let balanceAmount = '';
    total.value = '';
    if (isNew) {
        paid.value = '';
    }
    balance.value = '';

    if (selectedGstOption === 'include') {
        total.value = Number(paymentAmount.value);
    }

    if (selectedGstOption === 'exclude') {
        total.value = Number(paymentAmount.value) + Number(cgst.value) + Number(sgst.value);
    }

    if (isNew) {
        balanceAmount = discountedCourseFees - Number(paymentAmount.value);
    } else {
        balanceAmount = remainingAmount - Number(paymentAmount.value);
    }

    balance.value = `${balanceAmount} ₹`;
}

function toggleRupeeSign(inputString, operation) {
    if (operation === 'add') {
        // Add rupee sign if it doesn't exist
        return inputString.includes('₹') ? inputString : `${inputString} ₹`;
    } else if (operation === 'remove') {
        // Remove rupee sign if it exists
        return inputString.replace(' ₹', '');
    } else {
        // Invalid operation
        console.error('Invalid operation. Please use "add" or "remove".');
        return inputString;
    }
}

// Example of how to use setData with dummy data and a date
const dummyData = {
    "isNew": false,
    "personalInfo": {
        "memberId": "12345",
        "name": "John Doe",
        "phoneNumber": "1234567890",
        "email": "johndoe@example.com",
        "date": "2023-12-06",
        "invoiceNo": "INV123",
        "gstNo": "GSTN12345",
        "sacNo": "SACNO12345",
        "place": "Pune",
        "state": "Maharashtra"
    },
    "enrollmentInfo": {
        "courseName": "12 Weeks Body Transformation Challenge (Online) basic",
        "instructor": "Yuvaraj Nigade",
        "startDate": "2024-01-02",
        "endDate": "2024-03-26",
        "courseFee": "8000.00",
        "amountInWords": "eight thousand rupee",
        "discount": "0",
        "discountedFee": "8000.00",
        "memberGST": "",
        "paymentAmount": "1000",
        "gstOption": "excludeGST",
        "paid": "",
        "balance": "7000"
    },
    "plansData": {
        "12 Weeks Body Transformation Challenge (Online) basic": {
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
        "12 Weeks Body Transformation Challenge (Offline)": {
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
        "Yoga 20 Sessions Live (Online)": {
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
        "Diet Plan": {
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
};

// Set the date separately
function getDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    return formattedDate;
}

function printReceipt() {
    document.getElementsByTagName('meta')['viewport'].content = 'width=1440, initial-scale=1';
    window.print();
}

receiptForm.addEventListener('submit', function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Call the sendData function
    sendData();

    // Optionally, you can add additional logic or AJAX requests here
});

function sendData() {
    const selectedGstOption = document.querySelector('input[name="gstOption"]:checked').id;

    // Get data from personalInfo fields
    const memberIdValue = memberId.value;
    const nameValue = name.value;
    const phoneNumberValue = phoneNumber.value;
    const emailValue = email.value;
    const dateValue = date.value;
    const invoiceNoValue = invoiceNo.value;
    const gstNoValue = gstNo.value;
    const sacNoValue = sacNo.value;
    const placeValue = place.value;
    const stateValue = state.value;

    // Get data from enrollmentInfo fields
    const courseName = plan.value;
    const instructorValue = instructor.value;
    const startDateValue = startDate.value;
    const endDateValue = endDate.value;
    const courseFeeValue = toggleRupeeSign(courseFee.value, 'remove'); // Assuming you want to send the discounted amount without GST
    const amountInWordsValue = amountInWords.value;
    const discountValue = discount.value;
    const discountedFeeValue = toggleRupeeSign(discountedFee.value, 'remove');
    const memberGSTValue = memberGST.value;
    const paymentAmountValue = paymentAmount.value;
    const registrationFeeValue = registrationFee.value;
    const cgstValue = cgst.value;
    const sgstValue = sgst.value;
    const igstValue = igst.value;
    const gstOptionValue = selectedGstOption;
    const totalValue = total.value;
    const paidValue = paid.value;
    const balanceValue = toggleRupeeSign(balance.value, 'remove');

    // Create the JSON object
    const jsonData = {
        personalInfo: {
            memberId: memberIdValue,
            name: nameValue,
            phoneNumber: phoneNumberValue,
            email: emailValue,
            date: dateValue,
            invoiceNo: invoiceNoValue,
            gstNo: gstNoValue,
            sacNo: sacNoValue,
            place: placeValue,
            state: stateValue
        },
        enrollmentInfo: {
            courseName: courseName,
            instructor: instructorValue,
            startDate: startDateValue,
            endDate: endDateValue,
            courseFee: courseFeeValue,
            amountInWords: amountInWordsValue,
            discount: discountValue,
            discountedFee: discountedFeeValue,
            memberGST: memberGSTValue,
            paymentAmount: paymentAmountValue,
            registrationFee: registrationFeeValue,
            cgst: cgstValue,
            sgst: sgstValue,
            igst: igstValue,
            gstOption: gstOptionValue,
            total: totalValue,
            paid: paidValue,
            balance: balanceValue
        }
    };

    console.log(jsonData);
    console.log(JSON.stringify(jsonData));
}

// Call the setData function with the dummy data and date
document.addEventListener('DOMContentLoaded', () => {
    // setData(dummyData);
})
