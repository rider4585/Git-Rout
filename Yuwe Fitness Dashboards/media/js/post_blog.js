// Initialize Firebase (Replace with your Firebase project configuration)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const addInfographicModal = new bootstrap.Modal(document.getElementById('addBlogModal'));
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

// ...
uploadButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    const fileName = file.name;
    const blogHeader = document.getElementById('blogTitleInput').value;
    const blogDescription = document.getElementById('blogDescriptionInput').value

    if (file) {
        // Create a reference to the Firebase storage location
        const storageRef = storage.ref(`blog images/${file.name}`);

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

                // Generate a timestamp as the key
                const timestampKey = Date.now();

                // Set the data with the timestamp as the key
                db.ref('development/blogs').child(timestampKey).set({
                    fileName: fileName,
                    downloadUrl: downloadURL,
                    blogHeader: blogHeader,
                    blogDescription: blogDescription,
                })
                getAllImageLinks();
                addInfographicModal.hide();
            });
        });

    } else {
        console.error("No file selected.");
    }
});
// ...


// Add an event listener for the edit button in the createImageAccordion function
// editButton.addEventListener("click", function () {
//     openEditIndexModal(fileIndex, fileName);
// });

function openEditIndexModal(fileIndex, fileName) {
    const editIndexModal = new bootstrap.Modal(document.getElementById('editBlogContentModal'));
    const editBlogHeaderInput = document.getElementById('editBlogHeader');
    const editBlogDescriptionInput = document.getElementById('editBlogDescription');
    const downloadLink = allImageLinkData[fileIndex]['downloadUrl'];

    // Set the current index value in the input field
    // editIndexInput.value = fileIndex;

    // Add an event listener to the Save button in the edit index modal
    const saveIndexButton = document.getElementById('saveBlogChangesButton');
    saveIndexButton.addEventListener('click', function () {
        // const updatedIndex = editIndexInput.value;
        let updatedBlogData = {
            fileName: fileName,
            downloadUrl: downloadLink,
            blogHeader: editBlogHeaderInput.value,
            blogDescription: editBlogDescriptionInput.value
        }
        
        db.ref('development/blogs').child(fileIndex).set(updatedBlogData)
            .then(() => {
                // Close the edit index modal
                allImageLinkData[fileIndex] = updatedBlogData;
                // Update the accordions with the new data
                createImageAccordion(allImageLinkData);
                editIndexModal.hide();
            })
            .catch((error) => {
                console.error("Error updating index in the database:", error);
                alert(`Error updating index in the database: ${error.message}`);
            });
    });

    // Open the edit index modal
    editIndexModal.show();
}

// Function to get download URLs and file names of all uploaded images from the 'development/infographic' location
function getAllImageLinks() {
    const infographicRef = db.ref('development/blogs');

    return infographicRef.once('value')
        .then((snapshot) => {
            const imageLinks = {};

            snapshot.forEach((childSnapshot) => {
                const index = childSnapshot.key;
                const data = childSnapshot.val();

                // Assuming the structure is { fileName: ..., downloadUrl: ... }
                if (data.fileName && data.downloadUrl && data.blogHeader && data.blogDescription) {
                    imageLinks[index] = {
                        fileName: data.fileName,
                        downloadUrl: data.downloadUrl,
                        blogHeader: data.blogHeader,
                        blogDescription: data.blogDescription
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
    const accordionContainer = document.getElementById("blogAccordion");
    accordionContainer.innerHTML = '';
    // Iterate through the imageLinks and create accordions
    for (const fileIndex in imageLinks) {
        if (imageLinks.hasOwnProperty(fileIndex)) {
            const downloadURL = imageLinks[fileIndex]['downloadUrl'];
            const fileName = imageLinks[fileIndex]['fileName'];
            const blogHeader = imageLinks[fileIndex]['blogHeader'];
            const blogDescription = imageLinks[fileIndex]['blogDescription'];

            // Create the accordion HTML elements
            const accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");

            // const uniqueId = uniqueIdentifier(fileName); // Generate a unique ID for the accordion

            const accordionHeader = document.createElement("h2");
            accordionHeader.classList.add("accordion-header");

            const accordionButton = document.createElement("button");
            accordionButton.classList.add("accordion-button", "collapsed");
            accordionButton.setAttribute("type", "button");
            accordionButton.setAttribute("data-bs-toggle", "collapse");
            accordionButton.setAttribute("data-bs-target", `#collapse${fileIndex}`);
            accordionButton.setAttribute("aria-expanded", "false");
            accordionButton.setAttribute("aria-controls", `collapse${fileIndex}`);
            accordionButton.innerText = `${blogHeader}`;

            accordionHeader.appendChild(accordionButton);

            const accordionBody = document.createElement("div");
            accordionBody.classList.add("accordion-collapse", "collapse");
            accordionBody.setAttribute("id", `collapse${fileIndex}`);

            const accordionImage = document.createElement("img");
            accordionImage.classList.add('rounded', 'mx-auto', 'd-block', 'w-25', 'm-5');
            accordionImage.setAttribute("src", downloadURL);
            accordionImage.setAttribute("alt", fileName);

            // Convert the timestamp to a readable date format (DD/MM/YYYY)
            const datePosted = new Date(Number(fileIndex));
            const formattedDate = `${datePosted.getDate()}-${datePosted.getMonth() + 1}-${datePosted.getFullYear()}`;

            const blogPostDate = document.createElement('p');
            blogPostDate.classList.add('m-2');
            blogPostDate.innerHTML = `<strong>Date Posted</strong>: ${formattedDate}`;

            const imageDescription = document.createElement('p');
            imageDescription.classList.add('m-2');
            imageDescription.innerText = blogDescription;

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
            accordionBody.appendChild(blogPostDate);
            accordionBody.appendChild(imageDescription);
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
    // Replace whitespace with underscores and remove the file extension
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
    const confirmation = confirm(`Are you sure you want to delete the this blog?`);

    if (!confirmation) {
        return; // User canceled the deletion
    }

    const storageRef = storage.ref(`blog images/${fileName}`); // Adjust the path as needed

    // Delete the file
    return storageRef.delete()
        .then(() => {
            // Image deleted successfully from storage, now remove the reference from the database
            const infographicRef = db.ref(`development/blogs/${fileIndex}`);

            return infographicRef.remove()
                .then(() => {
                    // alert(`Image "${fileName}" has been deleted.`);
                    getAllImageLinks();
                })
                .catch((error) => {
                    console.error("Error removing reference from the database:", error);
                    alert(`Error removing reference for blog from the database: ${error.message}`);
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