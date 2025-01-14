// Ensure the DOM is fully loaded before running the script
window.onload = function() {
    // Call the retrieveData function after the page has fully loaded
    retrieveData();

    // Get the button by its ID
    const clearButton = document.getElementById('clear-storage-btn');

    // Attach a click event listener to the button
    clearButton.addEventListener('click', function() {
        // Clear all data in localStorage
        localStorage.clear();

        // Optional: You can display a message to confirm the action
        alert('localStorage has been cleared!');
    });
};

function retrieveData() {
    // Retrieve the data from localStorage using the same key ('user')
    const userData = localStorage.getItem('user');

    // Ensure the data exists in localStorage
    if (userData) {
        // Parse the JSON string back into an object
        const parsedData = JSON.parse(userData);

        // Debugging log to check the structure of parsedData
        console.log("Retrieved data:", parsedData);  // Debugging log

        // Make sure the element exists before trying to modify it
        const userInfoDiv = document.getElementById('user-info');
        
        if (userInfoDiv) {
            // Display the user data in the HTML
            userInfoDiv.innerHTML = `
                <p><strong>Unique ID:</strong> ${parsedData.unique_id}</p>
                <p><strong>Email:</strong> ${parsedData.email}</p>
                <p><strong>Username:</strong> ${parsedData.username}</p>
            `;
        } else {
            console.error('Element with id "user-info" not found.');
        }
    } else {
        // If no data found in localStorage
        document.getElementById('user-info').innerHTML = 'No user data found in localStorage.';
    }
}

