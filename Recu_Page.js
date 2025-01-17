// Initialisation de Supabase
const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Référencez la grille où les annonces seront insérées
const grid = document.getElementById('listingGrid');

// Initialize userData
let userData = null;

// Récupérer les userData à partir de localStorage
function retrieveData() {
    // Récupérer les userData à partir de localStorage
    const storedUserData = localStorage.getItem('user');
    
    if (storedUserData) {
        userData = JSON.parse(storedUserData);  // Mettre à jour la variable globale userData
        console.log("Retrieved user data:", userData);  // log pour déboguer
        
        // Display le nom d’utilisateur sur la page
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = `Username: ${userData.username}`;
        }
    } else {
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'No user data found in localStorage.';
        }
    }
}

async function fetchListings() {
    if (!userData) {
        console.error('Missing userData');
        return;  // Retour anticipé si userData est manquant
    }

    const username = userData.username;  // Accès au nom d’utilisateur à partir de userData
    console.log("Fetching listings for username:", username);

    try {
        // Récupérer les listes de l’utilisateur à partir de Supabase
        const { data: listings, error } = await supabaseClient
            .from('Compte')
            .select('newListing')
            .eq('username', username)
            .single();

        if (error) {
            throw error;
        }

        if (listings && listings.newListing) {
            const parsedListings = JSON.parse(listings.newListing);

            if (Array.isArray(parsedListings)) {
                parsedListings.forEach(listing => {
                    // Valider l’objet
                    if (listing && typeof listing === 'object' &&
                        typeof listing.title === 'string' &&
                        typeof listing.price === 'number' &&
                        typeof listing.image === 'string' &&
                        typeof listing.username === 'string' &&
                        typeof listing.departure === "string" &&
                        typeof listing.arrival === "string") {

                        // Consignez l’objet de liste pour voir sa structure
                        console.log('Listing object:', listing);

                        // Variable de la carte
                        const card = document.createElement('div');
                        card.className = 'card';

                        // Repli pour les URL d’images manquantes
                        const imageUrl = listing.image || 'https://via.placeholder.com/150';

                        // Générer le contenu de la carte
                        card.innerHTML = `
                            <img src="${imageUrl}" alt="Property Image">
                            <div class="card-content">
                                <h3>${listing.title}</h3>
                                <p>${listing.username || 'Unknown Host'}</p>
                                <p>De ${listing.arrival || "01/13/2025"}<p>
                                <p>A ${listing.departure|| "01/18/2025"}<p>
                                <p class="price">$${listing.price.toFixed(2)}</p>
                            </div>
                        `;

                        // Ajouter la carte à la grille
                        grid.appendChild(card);
                    } else {
                        console.error('Invalid listing format:', listing);
                    }
                });
            } else {
                console.error('Parsed listings is not an array:', parsedListings);
            }
        } else {
            grid.innerHTML = '<p>No listings found for this user.</p>';
        }
    } catch (error) {
        console.error('Error fetching listings:', error);
        grid.innerHTML = '<p>Failed to load listings. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    retrieveData();
    fetchListings();
});