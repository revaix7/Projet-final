///////Hart btn

document.addEventListener("DOMContentLoaded", function () {
    const likeButton = document.querySelector(".Like");

    likeButton.addEventListener("click", function () {
        const heartIcon = likeButton.querySelector(".heart-icon");

        // Toggle the "filled" class on the heart icon
        if (heartIcon.classList.contains("filled")) {
            heartIcon.classList.remove("filled");
            heartIcon.textContent = "♡"; // Outlined heart
        } else {
            heartIcon.classList.add("filled");
            heartIcon.textContent = "♥"; // Filled heart
        }
    });
});
// Call the function when the page loads to initialize the price
document.addEventListener('DOMContentLoaded', updatePrice);

////////Dropdown


// Filter the dropdown items based on the input text
function filterLocations() {
    const input = document.getElementById('location');
    const filter = input.value.toLowerCase();
    const dropdown = document.getElementById('location-dropdown');
    const items = dropdown.getElementsByClassName('dropdown-item');

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const text = item.innerText.toLowerCase();
        if (text.includes(filter)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    }
}

// Select a location and set it in the input field
function selectLocation(location) {
    const input = document.getElementById('location');
    input.value = location;  // Set the input's value to the selected location
    document.getElementById('location-dropdown').style.display = 'none'; // Hide the dropdown
}



////////// Price Constants
const pricePerNight = 310;  // Price per night in CAD
const cleaningFees = 350;   // Fixed cleaning fees
const serviceFees = 269;    // Fixed service fees
const taxRate = 0.13;       // Tax rate (13%)


////////// Update Price Function
function updatePrice() {
    // Get the arrival and departure dates
    const arrivalDate = document.getElementById('arrival-date').value;
    const departureDate = document.getElementById('departure-date').value;
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const timeDifference = departure - arrival;
    const numberOfNights = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days

    // Calculate the total price based on the number of nights
    const totalNightPrice = pricePerNight * numberOfNights;
    const totalTax = totalNightPrice * taxRate;
    const totalPrice = totalNightPrice + cleaningFees + serviceFees + totalTax;

    // Get the number of guests (can be used to modify the price further if needed)
    const guests = document.getElementById('guests').value;
    
    // Ensure at least 1 night is selected
    if (numberOfNights < 1) {
        alert("La durée de votre séjour doit être d'au moins 1 nuit.");
        return;
    }

    // Update the price breakdown
    document.getElementById('nights-breakdown').innerHTML = `${pricePerNight}$ CAD x ${numberOfNights} nuits <span id="total-night-price">${totalNightPrice}$ CAD</span>`;
    document.getElementById('total-price').innerHTML = `${totalPrice.toFixed(2)}$ CAD`;
    document.getElementById('cleaning-fees').innerText = `${cleaningFees}$ CAD`;
    document.getElementById('service-fees').innerText = `${serviceFees}$ CAD`;
    document.getElementById('taxes').innerText = `${totalTax.toFixed(2)}$ CAD`;
}

////////// Event Listeners for Input Fields
document.getElementById('arrival-date').addEventListener('change', updatePrice);
document.getElementById('departure-date').addEventListener('change', updatePrice);
document.getElementById('guests').addEventListener('change', updatePrice);




////////// Store Reservation Data Function
function storeReservationData() {
    
    // Get the form inputs
    const arrivalDateElement = document.getElementById('arrival-date').value;
    const departureDateElement = document.getElementById('departure-date').value;
    const pricePerNightElement = document.getElementById('price');
    const tnpElement = document.getElementById('total-night-price');
    const cleaningFeesElement = document.getElementById('cleaning-fees');
    const serviceFeesElement = document.getElementById('service-fees');
    const taxElement = document.getElementById('taxes');

    // Parse dates and calculate number of nights
    const arrival = new Date(arrivalDateElement);
    const departure = new Date(departureDateElement);
    const timeDifference = departure - arrival;
    const numberOfNights = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days

    // Retrieve values from the DOM after the checks
    const place = document.getElementById('place').innerText;
    const pricePerNight = parseFloat(pricePerNightElement.innerText);
    const cleaningFees = parseFloat(cleaningFeesElement.innerText);
    const serviceFees = parseFloat(serviceFeesElement.innerText);
    const totalTax = parseFloat(taxElement.innerText);
    const totalPrice = parseFloat(document.getElementById('total-price').innerText);

    // Ensure the elements exist before proceeding
    if (!arrivalDateElement || !departureDateElement || !pricePerNightElement || !tnpElement || !cleaningFeesElement || !serviceFeesElement) {
        alert("One or more elements are missing. Please check your HTML.");
        return;
    }

    // Validate the pricing data
    if (isNaN(pricePerNight) || isNaN(cleaningFees) || isNaN(serviceFees) || isNaN(numberOfNights)) {
        alert("Invalid pricing data. Please check your pricing elements.");
        return;
    }

    // Prepare the reservation data object
    const reservationData = {
        place: place,               // Use place from the DOM
        numberOfNights: numberOfNights,  // Use the calculated number of nights
        pricePerNight: pricePerNight,
        cleaningFees: cleaningFees,
        serviceFees: serviceFees,
        totalTax: totalTax,
        totalPrice: totalPrice
    };    

    // Store the reservation data in localStorage
    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    console.log("Storing data:", reservationData); // Debugging log

    alert('Reservation and pricing data has been stored in localStorage!');

    window.location.href = "Buy.html"; // Redirect to the Buy page
}

////////// Event Listener for Reservation Button
document.getElementById('Reserver').addEventListener('click', storeReservationData);

