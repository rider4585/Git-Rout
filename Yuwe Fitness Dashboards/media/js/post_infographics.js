// Initialize Firebase (Replace with your Firebase project configuration)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const addInfographicModal = new bootstrap.Modal(document.getElementById('addInfographicModal'));
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

let allImageLinkData = {};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.database();

// Get references to HTML elements
const fileInput = document.getElementById("infographicInput");
const uploadButton = document.getElementById("saveDataButton");

// Add a click event listener to the upload button
uploadButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    const fileName = file.name;
    const imageIndex = document.getElementById('indexInput').value;

    // console.log(imageIndex, fileName);

    if (file) {
        // Create a reference to the Firebase storage location
        const storageRef = storage.ref(`carousel infographic/${file.name}`);

        // Upload the file to Firebase storage
        const uploadTask = storageRef.put(file);

        // Add a reference to the progress bar element
        const progressBar = document.querySelector('.progress-bar');

        // Handle the upload progress
        uploadTask.on("state_changed", (snapshot) => {
            // Calculate the upload progress percentage
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            // Update the progress bar width and aria-valuenow attribute
            progressBar.style.width = progress + "%";
            progressBar.setAttribute("aria-valuenow", progress);

            // You can also display the progress percentage as text if desired
            progressBar.innerText = Math.round(progress) + "%";
        }, (error) => {
            console.error("Error uploading file:", error);
            alert(`Error uploading file: ${error.message}`);
        }, () => {
            // Upload successful, get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log("File available at", downloadURL);
                db.ref('development/infographic').child(imageIndex).set({
                    fileName: fileName,
                    downloadUrl: downloadURL,
                })
                getAllImageLinks();
                addInfographicModal.hide();
            });
        });

    } else {
        console.error("No file selected.");
    }
});

// Add an event listener for the edit button in the createImageAccordion function
// editButton.addEventListener("click", function () {
//     openEditIndexModal(fileIndex, fileName);
// });

function openEditIndexModal(fileIndex, fileName) {
    const editIndexModal = new bootstrap.Modal(document.getElementById('editIndexModal'));
    const editIndexInput = document.getElementById('editIndex');

    // Set the current index value in the input field
    editIndexInput.value = fileIndex;

    // Add an event listener to the Save button in the edit index modal
    const saveIndexButton = document.getElementById('saveIndexButton');
    saveIndexButton.addEventListener('click', function () {
        const updatedIndex = editIndexInput.value;

        // Check if the updated index doesn't already exist in the data
        if (!allImageLinkData[updatedIndex]) {
            // Remove the old index and add the data with the updated index
            const oldData = allImageLinkData[fileIndex];
            delete allImageLinkData[fileIndex];
            allImageLinkData[updatedIndex] = oldData;

            // Update the index key in the Firebase Realtime Database
            db.ref('development/infographic').child(fileIndex).remove()
                .then(() => {
                    db.ref('development/infographic').child(updatedIndex).set(oldData)
                        .then(() => {
                            // Close the edit index modal
                            editIndexModal.hide();

                            // Update the accordions with the new data
                            createImageAccordion(allImageLinkData);
                        })
                        .catch((error) => {
                            console.error("Error updating index in the database:", error);
                            alert(`Error updating index in the database: ${error.message}`);
                        });
                })
                .catch((error) => {
                    console.error("Error removing old index from the database:", error);
                    alert(`Error removing old index from the database: ${error.message}`);
                });
        } else {
            alert(`The index "${updatedIndex}" already exists. Please choose a different index.`);
        }
    });

    // Open the edit index modal
    editIndexModal.show();
}



// Function to get download URLs and file names of all uploaded images from the 'development/infographic' location
function getAllImageLinks() {
    const infographicRef = db.ref('development/infographic');

    return infographicRef.once('value')
        .then((snapshot) => {
            const imageLinks = {};

            snapshot.forEach((childSnapshot) => {
                const index = childSnapshot.key;
                const data = childSnapshot.val();

                // Assuming the structure is { fileName: ..., downloadUrl: ... }
                if (data.fileName && data.downloadUrl) {
                    imageLinks[index] = {
                        fileName: data.fileName,
                        downloadUrl: data.downloadUrl
                    };
                }
            });
            allImageLinkData = imageLinks;
            createImageAccordion(imageLinks);
            return imageLinks;
        })
        .catch((error) => {
            console.error("Error fetching image links:", error);
            return null;
        });
}

function createImageAccordion(imageLinks) {
    console.log(imageLinks);
    const accordionContainer = document.getElementById("imageAccordion");
    accordionContainer.innerHTML = '';

    // Iterate through the imageLinks and create accordions
    for (const fileIndex in imageLinks) {
        if (imageLinks.hasOwnProperty(fileIndex)) {
            const downloadURL = imageLinks[fileIndex]['downloadUrl'];
            const fileName = imageLinks[fileIndex]['fileName'];

            // Create the accordion HTML elements
            const accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");

            const uniqueId = uniqueIdentifier(fileName); // Generate a unique ID for the accordion

            const accordionHeader = document.createElement("h2");
            accordionHeader.classList.add("accordion-header");

            const accordionButton = document.createElement("button");
            accordionButton.classList.add("accordion-button", "collapsed");
            accordionButton.setAttribute("type", "button");
            accordionButton.setAttribute("data-bs-toggle", "collapse");
            accordionButton.setAttribute("data-bs-target", `#collapse${uniqueId}`);
            accordionButton.setAttribute("aria-expanded", "false");
            accordionButton.setAttribute("aria-controls", `collapse${uniqueId}`);
            accordionButton.innerText = `${fileIndex} - ${fileName}`;

            accordionHeader.appendChild(accordionButton);

            const accordionBody = document.createElement("div");
            accordionBody.classList.add("accordion-collapse", "collapse");
            accordionBody.setAttribute("id", `collapse${uniqueId}`);

            const accordionImage = document.createElement("img");
            accordionImage.classList.add('rounded', 'mx-auto', 'd-block', 'w-25', 'm-5');
            accordionImage.setAttribute("src", downloadURL);
            accordionImage.setAttribute("alt", fileName);

            // Create a div to contain the delete and edit buttons and align them to the right
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex", "justify-content-end", "m-2");

            // Create the delete button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-danger", "me-2");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", function () {
                deleteImage(fileName, fileIndex);
            });

            // Create the edit button
            const editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-secondary");
            editButton.innerText = "Edit";
            editButton.addEventListener("click", function () {
                openEditIndexModal(fileIndex, fileName);
            });

            // Append the delete and edit buttons to the button container
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(editButton);

            // Append the button container and image to the accordion body
            accordionBody.appendChild(accordionImage);
            accordionBody.appendChild(buttonContainer);

            accordionItem.appendChild(accordionHeader);
            accordionItem.appendChild(accordionBody);

            // Append the accordion item to the accordion container
            accordionContainer.appendChild(accordionItem);
        }
    }
}


// Function to generate a unique identifier for the accordion elements
function uniqueIdentifier(fileName) {
    // Replace whitespaces with underscores and remove the file extension
    const sanitizedFileName = fileName.replace(/\s+/g, "_").replace(/\..+$/, "");
    return sanitizedFileName;
}

// Call getAllImageLinks() to fetch image links and create accordions
getAllImageLinks();




// function loadInfographics(){
//     let allImageData = getAllImageLinks();
//     console.log(allImageData);
// }


function deleteImage(fileName, fileIndex) {
    const confirmation = confirm(`Are you sure you want to delete the image "${fileName}"?`);

    if (!confirmation) {
        return; // User canceled the deletion
    }

    const storageRef = storage.ref(`carousel infographic/${fileName}`); // Adjust the path as needed

    // Delete the file
    return storageRef.delete()
        .then(() => {
            // Image deleted successfully from storage, now remove the reference from the database
            const infographicRef = db.ref(`development/infographic/${fileIndex}`);

            return infographicRef.remove()
                .then(() => {
                    // alert(`Image "${fileName}" has been deleted.`);
                    getAllImageLinks();
                })
                .catch((error) => {
                    console.error("Error removing reference from the database:", error);
                    alert(`Error removing reference for image "${fileName}" from the database: ${error.message}`);
                });
        })
        .catch((error) => {
            // An error occurred while deleting the image
            console.error("Error deleting image:", error);
            alert(`Error deleting image "${fileName}": ${error.message}`);
        });
}



// Example usage of the function
// const fileNameToDelete = "example.jpg"; // Replace with the actual filename you want to delete

// deleteImage(fileNameToDelete)
//     .then(() => {
//         console.log(`Image '${fileNameToDelete}' has been deleted.`);
//     })
//     .catch((error) => {
//         console.error(`Error deleting image '${fileNameToDelete}':`, error);
//     });

// loadInfographics();