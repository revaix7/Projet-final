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
        insertListingForUser();  // Call the insertListingForUser function after checkout form submission
        //window.location.href = 'Recu.html';  // Redirect to a Thank You page after booking
    });

    // Handle the Cancel button click event
    document.getElementById('cancel-button').addEventListener('click', function () {
        localStorage.removeItem('reservationData');
        alert("Reservation has been cancelled.");
        window.location.href = "House.html";  // Redirect to the home page
    });

    // Call this function when you want to retrieve and display the reservation data
    getReservationData();
});

function getReservationData() {
    // Retrieve the reservation data from localStorage
    const reservationData = localStorage.getItem('reservationData');

    // Check if data exists in localStorage
    if (reservationData) {
        // Parse the stringified JSON data back into an object
        const parsedData = JSON.parse(reservationData);

        // Log the retrieved data (optional for debugging)
        console.log("Retrieved reservation data:", parsedData);

        // You can now use the parsedData object in your application
        // For example, you could display it on the page or use it elsewhere
        alert("Reservation data retrieved successfully!");

        // Example: Populate some DOM elements with the retrieved data
        document.getElementById('place').innerText = parsedData.place;
        document.getElementById('reservation-dates').innerHTML = parsedData.numberOfNights;
        document.getElementById('total-price').innerText = parsedData.numberOfNights * parsedData.pricePerNight;  // Ensure you calculate price dynamically
        document.getElementById('cleaning-fees').innerText = parsedData.cleaningFees;
        document.getElementById('service-fees').innerText = parsedData.serviceFees;
        document.getElementById('taxes').innerText = parsedData.totalTax;
        document.getElementById('total-price').innerText = parsedData.totalPrice;  // Ensure 'totalPrice' is present in parsedData

    } else {
        alert("No reservation data found in localStorage.");
    }
}

// Initialize Supabase
const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Ensure 'place' and 'totalPrice' are defined correctly
const reservationData = localStorage.getItem('reservationData');
let place, totalPrice;

if (reservationData) {
    // Parse the stringified JSON data back into an object
    const parsedData = JSON.parse(reservationData);
    place = parsedData.place;
    totalPrice = parsedData.totalPrice;
} else {
    alert("No reservation data found in localStorage.");
}

// Example data for new listing
const newListing = {
    title: place,
    price: totalPrice,
    image: "All_img/img_House/H1/H1_1.avif"
};

// The user ID that you're associating the listings with (e.g., from authentication)
const username = "as2"; // Replace with the actual user ID, e.g., from login or session

// Function to insert or append the new listing to the existing listings for the specific user
async function insertListingForUser() {
    try {
        // Fetch the current listings for the user
        const { data: currentData, error: fetchError } = await supabaseClient
            .from('Compte') // Your table name
            .select('newListing') // Select the column holding the listings
            .eq('username', username) // Filter by username
            .single(); // Assuming there is only one row per user

        if (fetchError) throw fetchError;

        // Log currentData for debugging
        console.log("Current Data:", currentData);

        // Initialize newListing as an array if it's not already an array
        const updatedListings = Array.isArray(currentData?.newListing) ? currentData.newListing : []; // Ensure it's an array

        // Append the new listing to the existing listings
        updatedListings.push(newListing);

        // Update the row with the updated listings array (this avoids replacing the entire row)
        const { data, error } = await supabaseClient
            .from('Compte') // Your table name
            .update({ newListing: updatedListings }) // Update the 'newListing' column
            .eq('username', username); // Only update for the specific user

        if (error) throw error;

        // Log the success message
        console.log("Listing inserted for user:", data);
    } catch (error) {
        console.error('Error inserting listing for user:', error);
    }
}



