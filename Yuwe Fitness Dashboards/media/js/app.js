// Initialize Firebase
const firebaseApp = Firebase.getInstance();
const recaptchaVerifier = firebaseApp.getRecaptchaVerifier();

function submitPhoneNumber() {
    const phoneNumber = document.getElementById('phone').value;

    firebaseApp.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
            firebaseApp.setConfirmationResult(confirmationResult);

            document.getElementById('phone-auth-form').style.display = 'none';
            document.getElementById('code-verification-form').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error during sign in with phone number', error);
            alert(error.message);
        });
}

function submitVerificationCode() {
    const verificationCode = document.getElementById('verification-code').value;
    const confirmationResult = firebaseApp.getConfirmationResult();

    firebaseApp.confirmVerificationCode(confirmationResult, verificationCode)
        .then(() => {
            console.log('Phone number verified');
            sessionStorage.setItem('loggedIn', true);
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Error during verification', error);
            alert(error);
        });
}