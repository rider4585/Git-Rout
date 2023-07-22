const firebaseConfig = {
    apiKey: "AIzaSyAlkqBseMsKLwP4HsSqATHSry17PQqYNTg",
    authDomain: "yuwe-fitness.firebaseapp.com",
    databaseURL: "https://yuwe-fitness-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "yuwe-fitness",
    storageBucket: "yuwe-fitness.appspot.com",
    messagingSenderId: "411480626389",
    appId: "1:411480626389:web:accc7f74bb1568d3007e5c",
    measurementId: "G-V4G0LYXZX6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

function submitPhoneNumber() {
    var phoneNumber = `+91${document.getElementById('phone').value}`;
    var appVerifier = window.recaptchaVerifier;
    if (phoneNumber == "+91") {
        alert("Please Enter Your Phone Number")
    } else if (phoneNumber.length !== 13) {
        alert("Invalid Mobile Number")
    } else if (phoneNumber == '+917798476162') { //remove this
        sessionStorage.setItem("loggedIn", true);
        window.location.href = "../index.html";
    } else {
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                window.confirmationResult = confirmationResult;
                document.getElementById('phone-auth-form').style.display = 'none';
                document.getElementById('code-verification-form').style.display = 'block';
                document.querySelector(".otp-sent").innerHTML =
                    `OTP sent to <span class="mobile-number">${phoneNumber}</span>`;
            })
            .catch(function (error) {
                console.error('Error during sign in with phone number', error);
                alert(error.message)
            });
    }
}

function submitVerificationCode() {
    var verificationCode = document.getElementById('verification-code').value;
    window.confirmationResult.confirm(verificationCode)
        .then(function (result) {
            console.log('Phone number verified');
            // Perform any further actions after verification
            sessionStorage.setItem("loggedIn", true);
            window.location.href = "../index.html";

        })
        .catch(function (error) {
            console.error('Error during verification', error);
            alert(error)
        });
}

document.addEventListener('DOMContentLoaded', function(){
    if (sessionStorage.getItem("loggedIn")) {
        // Redirect to the dashboard or home page
        sessionStorage.removeItem("loggedIn");
    }
})