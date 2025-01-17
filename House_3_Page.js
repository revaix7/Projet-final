// Bouton cœur

document.addEventListener("DOMContentLoaded", function () {
    const likeButton = document.querySelector(".Like");

    likeButton.addEventListener("click", function () {
        const heartIcon = likeButton.querySelector(".heart-icon");

        // Alterner la classe "filled" sur l'icône du cœur
        if (heartIcon.classList.contains("filled")) {
            heartIcon.classList.remove("filled");
            heartIcon.textContent = "♡"; // Cœur non rempli
        } else {
            heartIcon.classList.add("filled");
            heartIcon.textContent = "♥"; // Cœur rempli
        }
    });
});
// Appeler la fonction lorsque la page se charge pour initialiser le prix
document.addEventListener('DOMContentLoaded', updatePrice);

////////Dropdown

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

// Sélectionner un emplacement et le définir dans le champ de saisie
function selectLocation(location) {
    const input = document.getElementById('location');
    input.value = location;  // Définir la valeur du champ de saisie sur l'emplacement sélectionné
    document.getElementById('location-dropdown').style.display = 'none'; // Cacher le dropdown
}

////////// Constantes de prix
const pricePerNight = 910;  // Prix par nuit en CAD
const cleaningFees = 320;   // Frais de nettoyage fixes
const serviceFees = 539;    // Frais de service fixes
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

    // Obtenir le nombre d'invités (peut être utilisé pour modifier le prix si nécessaire)
    const guests = document.getElementById('guests').value;
    
    // S'assurer qu'au moins 1 nuit est sélectionnée
    if (numberOfNights < 1) {
        alert("La durée de votre séjour doit être d'au moins 1 nuit.");
        return;
    }

    // Mettre à jour la répartition du prix
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
    
    // Obtenir les entrées du formulaire
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
    const imageUrl = "All_img/img_House/H3/H3_1.avif";

    // S'assurer que les éléments existent avant de continuer
    if (!arrivalDateElement || !departureDateElement || !pricePerNightElement || !tnpElement || !cleaningFeesElement || !serviceFeesElement) {
        alert("Un ou plusieurs éléments sont manquants. Veuillez vérifier votre HTML.");
        return;
    }

    // Valider les données de tarification
    if (isNaN(pricePerNight) || isNaN(cleaningFees) || isNaN(serviceFees) || isNaN(numberOfNights)) {
        alert("Données de tarification invalides. Veuillez vérifier vos éléments de tarification.");
        return;
    }

    // Préparer l'objet de données de réservation
    const reservationData = {
        place: place,               // Utiliser le lieu à partir du DOM
        numberOfNights: numberOfNights,  // Utiliser le nombre de nuits calculé
        pricePerNight: pricePerNight,
        cleaningFees: cleaningFees,
        serviceFees: serviceFees,
        totalTax: totalTax,
        totalPrice: totalPrice,
        imageUrl: imageUrl
    };    

    // Stocker les données de réservation dans localStorage
    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    console.log("Données stockées:", reservationData); // Journal de débogage

    alert('Les données de réservation et de tarification ont été stockées dans localStorage !');

    window.location.href = "Buy.html"; // Rediriger vers la page d'achat
}

////////// Écouteur d'événement pour le bouton de réservation
document.getElementById('Reserver').addEventListener('click', storeReservationData);
