function isThisYuWeWebPage() {
    return true;
}

function setData(dummyData, date) {
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
}

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
        courseName: 'Fitness Training',
        plan: 'Premium',
        instructor: 'Jane Smith',
        startDate: '2023-10-01',
        endDate: '2024-03-31',
    },
    paymentInfo: {
        payMode: 'Credit Card',
        amountInWords: 'Two Thousand Five Hundred Dollars',
        memberGST: 'GST67890',
        courseFee: 2500,
        registrationFee: 100,
        discount: 0,
        cgst: 225,
        sgst: 225,
        igst: 0,
        total: 2850,
        paid: 1000,
        balance: 1850,
    },
};

// Set the date separately
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
const formattedDate = `${yyyy}-${mm}-${dd}`;

// Call the setData function with the dummy data and date
setData(dummyData, formattedDate);