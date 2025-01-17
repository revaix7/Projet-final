// Bouton cœur

document.addEventListener("DOMContentLoaded", function () {
    const likeButton = document.querySelector(".Like");

    likeButton.addEventListener("click", function () {
        const heartIcon = likeButton.querySelector(".heart-icon");

        // Basculez la classe "filled" sur l'icône du cœur
        if (heartIcon.classList.contains("filled")) {
            heartIcon.classList.remove("filled");
            heartIcon.textContent = "♡"; // Cœur contour
        } else {
            heartIcon.classList.add("filled");
            heartIcon.textContent = "♥"; // Cœur rempli
        }
    });
});
// Appelez la fonction lorsque la page est chargée pour initialiser le prix
document.addEventListener('DOMContentLoaded', updatePrice);

////////// Dropdown

// Filtrer les éléments du dropdown en fonction du texte saisi
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

// Sélectionner une localisation et la définir dans le champ de saisie
function selectLocation(location) {
    const input = document.getElementById('location');
    input.value = location;  // Définir la valeur du champ de saisie sur la localisation sélectionnée
    document.getElementById('location-dropdown').style.display = 'none'; // Cacher le dropdown
}

////////// Constantes de prix
const pricePerNight = 919;  // Prix par nuit en CAD
const cleaningFees = 464;   // Frais de nettoyage fixes
const serviceFees = 390;    // Frais de service fixes
const taxRate = 0.13;       // Taux de taxe (13%)

////////// Fonction de mise à jour du prix
function updatePrice() {
    // Obtenir les dates d'arrivée et de départ
    const arrivalDate = document.getElementById('arrival-date').value;
    const departureDate = document.getElementById('departure-date').value;
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const timeDifference = departure - arrival;
    const numberOfNights = timeDifference / (1000 * 3600 * 24); // Convertir les millisecondes en jours

    // Calculer le prix total en fonction du nombre de nuits
    const totalNightPrice = pricePerNight * numberOfNights;
    const totalTax = totalNightPrice * taxRate;
    const totalPrice = totalNightPrice + cleaningFees + serviceFees + totalTax;

    // Obtenir le nombre de personnes (peut être utilisé pour modifier le prix si nécessaire)
    const guests = document.getElementById('guests').value;
    
    // S'assurer qu'au moins 1 nuit est sélectionnée
    if (numberOfNights < 1) {
        alert("La durée de votre séjour doit être d'au moins 1 nuit.");
        return;
    }

    // Mettre à jour le détail du prix
    document.getElementById('nights-breakdown').innerHTML = `${pricePerNight}$ CAD x ${numberOfNights} nuits <span id="total-night-price">${totalNightPrice}$ CAD</span>`;
    document.getElementById('total-price').innerHTML = `${totalPrice.toFixed(2)}$ CAD`;
    document.getElementById('cleaning-fees').innerText = `${cleaningFees}$ CAD`;
    document.getElementById('service-fees').innerText = `${serviceFees}$ CAD`;
    document.getElementById('taxes').innerText = `${totalTax.toFixed(2)}$ CAD`;
}

////////// Écouteurs d'événements pour les champs de saisie
document.getElementById('arrival-date').addEventListener('change', updatePrice);
document.getElementById('departure-date').addEventListener('change', updatePrice);
document.getElementById('guests').addEventListener('change', updatePrice);

////////// Fonction de stockage des données de réservation
function storeReservationData() {
    
    // Obtenez les entrées du formulaire
    const arrivalDateElement = document.getElementById('arrival-date').value;
    const departureDateElement = document.getElementById('departure-date').value;
    const pricePerNightElement = document.getElementById('price');
    const tnpElement = document.getElementById('total-night-price');
    const cleaningFeesElement = document.getElementById('cleaning-fees');
    const serviceFeesElement = document.getElementById('service-fees');
    const taxElement = document.getElementById('taxes');

    // Analyser les dates et calculer le nombre de nuits
    const arrival = new Date(arrivalDateElement);
    const departure = new Date(departureDateElement);
    const timeDifference = departure - arrival;
    const numberOfNights = timeDifference / (1000 * 3600 * 24); // Convertir les millisecondes en jours

    // Récupérer les valeurs du DOM après les vérifications
    const place = document.getElementById('place').innerText;
    const pricePerNight = parseFloat(pricePerNightElement.innerText);
    const cleaningFees = parseFloat(cleaningFeesElement.innerText);
    const serviceFees = parseFloat(serviceFeesElement.innerText);
    const totalTax = parseFloat(taxElement.innerText);
    const totalPrice = parseFloat(document.getElementById('total-price').innerText);
    const imageUrl = "All_img/img_House/H5/H5_1.avif";

    // Assurez-vous que les éléments existent avant de continuer
    if (!arrivalDateElement || !departureDateElement || !pricePerNightElement || !tnpElement || !cleaningFeesElement || !serviceFeesElement) {
        alert("Un ou plusieurs éléments manquent. Veuillez vérifier votre HTML.");
        return;
    }

    // Valider les données de prix
    if (isNaN(pricePerNight) || isNaN(cleaningFees) || isNaN(serviceFees) || isNaN(numberOfNights)) {
        alert("Données de prix invalides. Veuillez vérifier vos éléments de prix.");
        return;
    }

    // Préparer l'objet de données de réservation
    const reservationData = {
        arrival: arrival,
        departure: departure,
        place: place,               // Utiliser le lieu depuis le DOM
        numberOfNights: numberOfNights,  // Utiliser le nombre de nuits calculé
        pricePerNight: pricePerNight,
        cleaningFees: cleaningFees,
        serviceFees: serviceFees,
        totalTax: totalTax,
        totalPrice: totalPrice,
        imageUrl: imageUrl
    };    

    // Stocker les données de réservation dans le localStorage
    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    console.log("Enregistrement des données:", reservationData); // Journal de débogage

    alert('Les données de réservation et de prix ont été stockées dans localStorage!');

    window.location.href = "Buy.html"; // Redirection vers la page Buy
}

////////// Écouteur d'événement pour le bouton de réservation
document.getElementById('Reserver').addEventListener('click', storeReservationData);
