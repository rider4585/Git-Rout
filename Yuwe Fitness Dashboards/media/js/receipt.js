class DataGenerator {
    constructor() {
        this.data = {
            personalInfo: {
                memberId: '',
                name: '',
                phoneNumber: '',
                email: '',
                date: '',
                invoiceNo: '',
                gstNo: '',
                sacNo: '',
                place: '',
                state: '',
            },
            enrollmentInfo: {
                courseName: '',
                plan: '',
                instructor: '',
                startDate: '',
                endDate: '',
            },
            paymentInfo: {
                payMode: '',
                amountInWords: '',
                memberGST: '',
                courseFee: 0,
                registrationFee: 0,
                discount: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                total: 0,
                paid: 0,
                balance: 0,
            },
        };
    }

    setFieldValue(section, field, value) {
        this.data[section][field] = value;
    }

    calculateTotal() {
        const {
            courseFee,
            registrationFee,
            discount,
            cgst,
            sgst,
            igst
        } = this.data.paymentInfo;
        this.data.paymentInfo.total =
            parseFloat(courseFee) +
            parseFloat(registrationFee) -
            parseFloat(discount) +
            parseFloat(cgst) +
            parseFloat(sgst) +
            parseFloat(igst);
    }

    calculateBalance() {
        const {
            total,
            paid
        } = this.data.paymentInfo;
        this.data.paymentInfo.balance = total - parseFloat(paid);
    }

    generateJSON() {
        return this.data;
    }

    static isFieldEmpty(data) {
        for (const section in data) {
            for (const key in data[section]) {
                if (data[section][key] == '') {
                    return true;
                }
            }
        }
        return false;
    }

    static isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    validateInputFields() {
        const {
            courseFee,
            registrationFee,
            discount,
            cgst,
            sgst,
            igst,
            paid
        } = this.data.paymentInfo;

        const validateField = (field) => {
            return DataGenerator.isNumber(field) && parseFloat(field) >= 0;
        };

        return (
            validateField(courseFee) &&
            validateField(registrationFee) &&
            validateField(discount) &&
            validateField(cgst) &&
            validateField(sgst) &&
            validateField(igst) &&
            validateField(paid)
        );
    }

    sendData() {
        // Add security constraints to validate the source of the request
        console.log(this.data);
        if (isThisYuWeWebPage()) {
            SendDataToFlutter.postMessage(JSON.stringify(this.data));
        }
    }
}

function calculateTotalAndBalance() {
    const dataGenerator = new DataGenerator();
    const courseFee = parseFloat(document.querySelector("input[placeholder='Enter Course Fee']").value);
    const cgstRate = 9; // CGST rate is 9%
    const sgstRate = 9; // SGST rate is 9%
    const igstRate = 0; // IGST rate is 0%

    const cgst = (courseFee * cgstRate) / 100;
    const sgst = (courseFee * sgstRate) / 100;
    const igst = (courseFee * igstRate) / 100;

    dataGenerator.setFieldValue('paymentInfo', 'cgst', cgst.toFixed(2));
    dataGenerator.setFieldValue('paymentInfo', 'sgst', sgst.toFixed(2));
    dataGenerator.setFieldValue('paymentInfo', 'igst', igst.toFixed(2));
    dataGenerator.setFieldValue('paymentInfo', 'courseFee', courseFee);

    const paidFees = document.querySelector("input[placeholder='Enter Paid Fees']").value;
    dataGenerator.setFieldValue('paymentInfo', 'paid', paidFees);

    if (dataGenerator.validateInputFields()) {
        dataGenerator.calculateTotal();
        dataGenerator.calculateBalance();

        const totalField = document.querySelector("input[placeholder='Enter Total']");
        const balanceField = document.querySelector("input[placeholder='Enter Balance']");

        totalField.value = dataGenerator.generateJSON().paymentInfo.total.toFixed(2);
        balanceField.value = dataGenerator.generateJSON().paymentInfo.balance.toFixed(2);
    } else {
        alert('Please enter valid numeric values for the input fields.');
    }
}

function validateResponse() {
    const dataGenerator = new DataGenerator();

    const personalInfoFields = [
        'memberId',
        'name',
        'phoneNumber',
        'email',
        'date',
        'invoiceNo',
        'gstNo',
        'sacNo',
        'place',
        'state',
    ];
    const enrollmentInfoFields = [
        'courseName',
        'plan',
        'instructor',
        'startDate',
        'endDate',
    ];
    const paymentInfoFields = [
        'payMode',
        'amountInWords',
        'memberGST',
        'courseFee',
        'registrationFee',
        'discount',
        'cgst',
        'sgst',
        'igst',
        'total',
        'paid',
        'balance'
    ];

    personalInfoFields.forEach((field) => {
        let inputField = document.querySelector(`#${field}`);
        dataGenerator.setFieldValue('personalInfo', field, inputField ? inputField.value : '');
    });

    enrollmentInfoFields.forEach((field) => {
        let inputField = document.querySelector(`#${field}`);
        dataGenerator.setFieldValue('enrollmentInfo', field, inputField ? inputField.value : '');
    });

    paymentInfoFields.forEach((field) => {
        let inputField = document.querySelector(`#${field}`);
        dataGenerator.setFieldValue('paymentInfo', field, inputField ? inputField.value : '');
    });

    if (DataGenerator.isFieldEmpty(dataGenerator.generateJSON())) {
        alert('Please fill in all the required fields.');
    } else {
        dataGenerator.sendData();
    }
}

function isThisYuWeWebPage() {
    return true;
}

function setData(data) {
    if (data != "" && data != null && data != undefined) {
        if (data.hasOwnProperty('name')) {
            document.getElementById("name").value = data['name'];
        }

        if (data.hasOwnProperty('phoneNumber')) {
            document.getElementById("phoneNumber").value = data['phoneNumber'];
            document.getElementById("memberId").value = data['phoneNumber'];
        }
    }

    const dateInput = document.getElementById('date');
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    console.log(formattedDate);
    dateInput.value = formattedDate;
}

// setData({
//     'name': 'Raviraj Mahendra Bugge',
//     'phoneNumber': '7798476162'
// })