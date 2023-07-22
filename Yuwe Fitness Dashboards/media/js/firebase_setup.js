class Firebase {
    constructor() {
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
        firebase.initializeApp(firebaseConfig);

        this.confirmationResult = null;
    }

    static getInstance() {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }

        return Firebase.instance;
    }

    getRecaptchaVerifier() {
        return new firebase.auth.RecaptchaVerifier('recaptcha-container');
    }

    signInWithPhoneNumber(phoneNumber, appVerifier) {
        return firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
    }

    setConfirmationResult(confirmationResult) {
        this.confirmationResult = confirmationResult;
    }

    getConfirmationResult() {
        return this.confirmationResult;
    }

    confirmVerificationCode(confirmationResult, verificationCode) {
        return confirmationResult.confirm(verificationCode);
    }
}

// Export the Firebase class
window.Firebase = Firebase;