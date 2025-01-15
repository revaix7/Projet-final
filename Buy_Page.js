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
        window.location.href = 'Like.html';  // Redirect to a Thank You page after booking
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
        document.getElementById('total-price').innerText = parsedData.numberOfNights * parsedData.pricePerNight;
        document.getElementById('cleaning-fees').innerText = parsedData.cleaningFees;
        document.getElementById('service-fees').innerText = parsedData.serviceFees;
        document.getElementById('taxes').innerText = parsedData.totalTax;
        document.getElementById('total-price').innerText = parsedData.totalPrice;

    } else {
        alert("No reservation data found in localStorage.");
    }
}
