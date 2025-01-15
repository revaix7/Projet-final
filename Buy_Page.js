document.addEventListener('DOMContentLoaded', function () {
    // Check if reservation data is in localStorage
    const storedData = JSON.parse(localStorage.getItem('reservationData'));

    if (storedData) {
        // Display reservation data on the page
        const place =document.getElementById('place').textContent = storedData.reservation.place;
        const numberOfNights = document.getElementById('reservation-dates').textContent = storedData.reservation.numberOfNights;
        const totalPrice = document.getElementById('total-price').textContent = `$${storedData.pricing.totalPrice.toFixed(2)} CAD`;

        // Display fees information
        const cleaningFees = document.getElementById('cleaning-fees').textContent = `$${storedData.pricing.cleaningFees} CAD`;
        const serviceFees = document.getElementById('service-fees').textContent = `$${storedData.pricing.serviceFees} CAD`;
        const totalTax = document.getElementById('taxes').textContent = `$${storedData.pricing.totalTax.toFixed(2)} CAD`;
    } else {    
        alert("No reservation data found. Please make a reservation first.");
    }

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
        window.location.href = 'thank_you.html';  // Redirect to a Thank You page after booking
    });

    // Handle the Cancel button click event
    document.getElementById('cancel-button').addEventListener('click', function () {
        // Remove reservation data from localStorage
        localStorage.removeItem('reservationData');

        // Alert to notify the user that the reservation has been cancelled
        alert("Reservation has been cancelled.");

        // Close the current window/tab
        window.location.href = "House.html"; // Redirect to the home page  // Closes the current tab, will not work if the page was opened by a script
    });
});


// Function to store reservation data (you can call this after user interaction)
function storeReservationData() {
    // Example values for demonstration, you should replace these with actual data
    
    const reservationData = {
        reservation: {
            place,
            numberOfNights,
        },
        pricing: {
            pricePerNight,
            cleaningFees,
            serviceFees,
            totalTax,
            totalPrice
        }
    };

    // Store it in localStorage as a JSON string
    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    console.log(localStorage.getItem('reservationData'));

    alert('Reservation data has been stored in localStorage!');
}

// Optionally, you can call storeReservationData() directly for testing purposes
storeReservationData();  // For now, we call this directly for demo purposes.
