document.getElementById('checkout-form').addEventListener('submit', function(event) {
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

    // Here, you would typically send the data to your server for further processing
    // Example: POST request to your backend to process the payment

    // For now, just alert the user that the booking is complete
    alert(`Booking Complete!\nName: ${name}\nEmail: ${email}\nAddress: ${address}\nPayment Method: ${paymentMethod}\nExpiration Date: ${expirationDate}`);

    // Optionally, clear the form or redirect to a thank you page
    document.getElementById('checkout-form').reset();
    window.location.href = 'thank_you.html';  // Redirect to a Thank You page after booking
});
