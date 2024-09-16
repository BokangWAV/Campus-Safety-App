
import { getStorage } from '/modules/init.js';

// Initialize Firebase Storage
const storage = getStorage();

async function uploadFiles(files, folderName) {
    const uploadPromises = Array.from(files).map(file => {
        const storageRef = storage.ref(`${folderName}/${file.name}`);
        return storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL());
    });

    return Promise.all(uploadPromises);
}

async function editImage() {
    // Trigger file input click to allow user to select image
    document.getElementById('imageUpload').click();

    document.getElementById('imageUpload').onchange = async function () {
        const imageFiles = document.getElementById("imageUpload").files;
        let imageUrls = [];

        if (imageFiles.length > 0) {
            imageUrls = await uploadFiles(imageFiles, 'profile_images'); // Upload images to 'profile_images' folder

            // Update the profile picture after successful upload
            const newProfilePicUrl = imageUrls[0];
            document.getElementById('profileImg').style.backgroundImage = `url(${newProfilePicUrl})`;

            // Optionally, send the updated URL to the backend to save it in the user profile
            try {
                await fetch('/update-profile-picture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ profilePicture: newProfilePicUrl })
                });
                console.log('Profile picture updated successfully');
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        } else {
            console.log("No image selected.");
        }
    };
}
