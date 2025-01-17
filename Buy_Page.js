// Initialiser Supabase
const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Remplacer par votre URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Remplacer par votre clé anonyme

let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function () {
    // Ajouter un écouteur d'événements pour le formulaire de paiement
    document.getElementById('checkout-form').addEventListener('submit', function (event) {
        event.preventDefault();  // Empêcher l'envoi par défaut du formulaire

        // Collecter les données du formulaire
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvv = document.getElementById('cvv').value;

        // Validation simple pour les champs vides
        if (!name || !email || !address || !paymentMethod || !expirationDate || !cvv) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Pour l'instant, juste avertir l'utilisateur que la réservation est terminée
        alert(`Réservation terminée !\nNom : ${name}\nEmail : ${email}\nAdresse : ${address}\nMode de paiement : ${paymentMethod}\nDate d'expiration : ${expirationDate}`);

        // Optionnellement, réinitialiser le formulaire ou rediriger vers une page de remerciements
        document.getElementById('checkout-form').reset();
        retrieveData();  // Récupérer et afficher les données de l'utilisateur
        insertListingForUser();  // Appeler insertListingForUser sans passer parsedData
        // Appeler cette fonction lorsque vous voulez récupérer et afficher les données de la réservation
        setTimeout(function() {
            window.location.href = "Recu.html";  // Rediriger vers la page de reçu
        }, 2500);  // Attendre 2,5 secondes
    });

    // Gérer l'événement de clic sur le bouton Annuler
    document.getElementById('cancel-button').addEventListener('click', function () {
        localStorage.removeItem('reservationData');
        alert("La réservation a été annulée.");
        window.location.href = "House.html";  // Rediriger vers la page d'accueil
    });
    getReservationData();
 
});

// Déclarer parsedData globalement
let parsedData = null;
let userData = null;

function getReservationData() {
    // Récupérer les données de réservation depuis le localStorage
    const reservationData = localStorage.getItem('reservationData');

    // Vérifier si des données existent dans le localStorage
    if (reservationData) {
        // Analyser les données JSON en chaîne de caractères pour les reconvertir en objet
        parsedData = JSON.parse(reservationData);

        // Afficher toutes les données récupérées pour voir leur structure
        console.log("Données de réservation récupérées :", parsedData);

        // Vous pouvez maintenant utiliser l'objet parsedData dans votre application
        // Exemple : Remplir certains éléments du DOM avec les données récupérées
        document.getElementById('place').innerText = parsedData.place;
        document.getElementById('reservation-dates').innerHTML = parsedData.numberOfNights;
        document.getElementById('total-price').innerText = parsedData.numberOfNights * parsedData.pricePerNight;
        document.getElementById('cleaning-fees').innerText = parsedData.cleaningFees;
        document.getElementById('service-fees').innerText = parsedData.serviceFees;
        document.getElementById('taxes').innerText = parsedData.totalTax;
        document.getElementById('total-price').innerText = parsedData.totalPrice;

    } else {
        alert("Aucune donnée de réservation trouvée dans le localStorage.");
    }
}

async function insertListingForUser() {
    if (!userData || !parsedData) {
        console.error('Données utilisateur ou données de réservation manquantes');
        return;  // Retourner tôt si les données sont manquantes
    }

    const place = parsedData.place;
    const totalPrice = parsedData.totalPrice;
    const username = userData.username;  // Accéder au nom d'utilisateur depuis userData
    const imageUrl = parsedData.imageUrl;
    console.log("Nom d'utilisateur :", username);

    // Exemple de données pour une nouvelle annonce
    const newListing = {
        title: place,
        price: totalPrice,
        image: imageUrl,
        username: username,  // S'assurer que le nom d'utilisateur est inclus dans l'annonce
    };

    try {
        // Récupérer les annonces existantes pour l'utilisateur
        const { data: existingData, error: fetchError } = await supabaseClient
            .from('Compte')  // Remplacer par votre nom de table Supabase
            .select('newListing')
            .eq('username', username)
            .single();

        if (fetchError) {
            console.error("Erreur lors de la récupération des annonces existantes :", fetchError);
            alert("Échec de la récupération des annonces existantes. Veuillez réessayer.");
            return;
        }

        // Analyser les annonces existantes ou initialiser un tableau vide s'il n'y en a pas
        let existingListings = [];
        if (existingData && existingData.newListing) {
            try {
                existingListings = JSON.parse(existingData.newListing);
                if (!Array.isArray(existingListings)) {
                    existingListings = [];
                }
            } catch (e) {
                console.error("Erreur lors de l'analyse des annonces existantes :", e);
                existingListings = [];
            }
        }

        // Ajouter la nouvelle annonce à la liste existante
        existingListings.push(newListing);

        // Mettre à jour les annonces de l'utilisateur dans Supabase
        const { data, error } = await supabaseClient
            .from('Compte')  // Remplacer par votre nom de table Supabase
            .update({ newListing: JSON.stringify(existingListings) })
            .eq('username', username);

        if (error) {
            console.error("Erreur lors de la mise à jour des annonces :", error);
            alert("Échec de la mise à jour des annonces. Veuillez réessayer.");
        } else {
            console.log("Annonce mise à jour avec succès :", data);
            alert("Annonce ajoutée avec succès !");
        }
    } catch (err) {
        console.error('Erreur lors de l\'insertion dans Supabase :', err);
        alert("Une erreur est survenue lors de l'insertion de l'annonce.");
    }
}


function retrieveData() {
    // Récupérer les données du localStorage avec la même clé ('user')
    const storedUserData = localStorage.getItem('user');
    
    // Vérifier si des données existent dans le localStorage
    if (storedUserData) {
        // Analyser la chaîne JSON pour la reconvertir en objet
        userData = JSON.parse(storedUserData);  // Mettre à jour la variable globale

        // Log de débogage pour vérifier la structure de userData
        console.log("Données utilisateur récupérées :", userData);  // Log de débogage

        // Accéder et utiliser les données utilisateur ici
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            // Exemple : Afficher le nom d'utilisateur sur la page
            userInfoDiv.innerHTML = `Nom d'utilisateur : ${userData.username}`;
        }
    } else {
        // Si aucune donnée n'a été trouvée dans le localStorage
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'Aucune donnée utilisateur trouvée dans le localStorage.';
        }
    }
}
