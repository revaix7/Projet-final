// Initialize Supabase
const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the checkout form
    document.getElementById('checkout-form').addEventListener('submit', function (event) {
        event.preventDefault();  // Prevent default form submission

        // Collect form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvv = document.getElementById('cvv').value;

        // Simple validation for empty fields
        if (!name || !email || !address || !paymentMethod || !expirationDate || !cvv) {
            alert("Please fill out all fields.");
            return;
        }

        // For now, just alert the user that the booking is complete
        alert(`Booking Complete!\nName: ${name}\nEmail: ${email}\nAddress: ${address}\nPayment Method: ${paymentMethod}\nExpiration Date: ${expirationDate}`);

        // Optionally, clear the form or redirect to a thank you page
        document.getElementById('checkout-form').reset();
        retrieveData();  // Retrieve and display user data
        insertListingForUser();  // Now call insertListingForUser without passing parsedData
        // Call this function when you want to retrieve and display the reservation data
        getReservationData();
        window.location.href = "Recu.html";  // Redirect to the home page
    });

    // Handle the Cancel button click event
    document.getElementById('cancel-button').addEventListener('click', function () {
        localStorage.removeItem('reservationData');
        alert("Reservation has been cancelled.");
        window.location.href = "House.html";  // Redirect to the home page
    });
 
});

// Declare parsedData globally
let parsedData = null;
let userData = null;

function getReservationData() {
    // Retrieve the reservation data from localStorage
    const reservationData = localStorage.getItem('reservationData');

    // Check if data exists in localStorage
    if (reservationData) {
        // Parse the stringified JSON data back into an object
        parsedData = JSON.parse(reservationData);

        // Log the entire parsedData to see the structure
        console.log("Retrieved reservation data:", parsedData);

        // You can now use the parsedData object in your application
        // Example: Populate some DOM elements with the retrieved data
        document.getElementById('place').innerText = parsedData.place;
        document.getElementById('reservation-dates').innerHTML = parsedData.numberOfNights;
        document.getElementById('total-price').innerText = parsedData.numberOfNights * parsedData.pricePerNight;
        document.getElementById('cleaning-fees').innerText = parsedData.cleaningFees;
        document.getElementById('service-fees').innerText = parsedData.serviceFees;
        document.getElementById('taxes').innerText = parsedData.totalTax;
        document.getElementById('total-price').innerText = parsedData.totalPrice;

    } else {
        alert("No reservation data found in localStorage.");
    }
}

async function insertListingForUser() {
    if (!userData || !parsedData) {
        console.error('Missing userData or parsedData');
        return;  // Early return if data is missing
    }

    const place = parsedData.place;
    const totalPrice = parsedData.totalPrice;
    const username = userData.username;  // Accessing username from userData
    console.log("Username:", username);
    // Example data for new listing
    const newListing = {
        title: place,
        price: totalPrice,
        image: "All_img/img_House/H1/H1_1.avif",
        username: username,  // Ensure the username is included in the listing
    };

    // Log the new listing to check the data structure
    console.log("New Listing Data:", newListing);

    try {
        // Insert or update the new listing in Supabase
        const { data, error } = await supabaseClient
            .from('Compte')  // Replace with your actual Supabase table name
            .upsert({        // Use upsert to insert or update
                username: username,
                newListing: newListing,  // Store the listing under the user's data
            });

        if (error) {
            console.error("Error inserting listing:", error);  // Log any Supabase errors
            alert("Failed to insert listing. Please try again.");
        } else {
            console.log("Listing successfully inserted:", data);  // Log the response
            alert("Listing added successfully!");
        }
    } catch (err) {
        console.error('Error during Supabase insertion:', err);  // Log unexpected errors
        alert("An error occurred while inserting the listing.");
    }
}


function retrieveData() {
    // Retrieve the data from localStorage using the same key ('user')
    const storedUserData = localStorage.getItem('user');
    
    // Ensure the data exists in localStorage
    if (storedUserData) {
        // Parse the JSON string back into an object
        userData = JSON.parse(storedUserData);  // Update the global variable

        // Debugging log to check the structure of userData
        console.log("Retrieved user data:", userData);  // Debugging log

        // Access and use user data here
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            // Example: Display the username on the page
            userInfoDiv.innerHTML = `Username: ${userData.username}`;
        }
    } else {
        // If no data found in localStorage
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'No user data found in localStorage.';
        }
    }
}
