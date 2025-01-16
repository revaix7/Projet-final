const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

// Initialize Supabase client
let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
// Reference the grid where listings will be inserted
const grid = document.getElementById('listingGrid');

// Initialize userData
let userData = null;

// Retrieve the userData from localStorage
function retrieveData() {
    // Retrieve the userData from localStorage
    const storedUserData = localStorage.getItem('user');
    
    if (storedUserData) {
        userData = JSON.parse(storedUserData);  // Update the global userData variable
        console.log("Retrieved user data:", userData);  // Debugging log
        
        // Display the username on the page
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
document.addEventListener('DOMContentLoaded', async function () {
    const grid = document.getElementById('listing-grid');

    try {
        // Fetch listings from Supabase or local storage
        const { data: listings, error } = await supabaseClient
            .from('Compte')  // Replace with your actual Supabase table name
            .select('title, price, image, username');

        if (error) {
            throw error;
        }

        if (listings && listings.length > 0) {
            listings.forEach(listing => {
                // Validate the listing object
                if (listing && typeof listing === 'object' &&
                    typeof listing.title === 'string' &&
                    typeof listing.price === 'number' &&
                    typeof listing.image === 'string' &&
                    typeof listing.username === 'string') {

                    // Log the listing object to see its structure
                    console.log('Listing object:', listing);

                    // Declare the card variable here
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Fallback for missing image URLs
                    const imageUrl = listing.image || 'https://via.placeholder.com/150';

                    // Generate the card content
                    card.innerHTML = `
                        <img src="${imageUrl}" alt="Property Image">
                        <div class="card-content">
                            <h3>${listing.title}</h3>
                            <p>${listing.username || 'Unknown Host'}</p>
                            <p class="price">$${listing.price.toFixed(2)}</p>
                        </div>
                    `;

                    // Append the card to the grid
                    grid.appendChild(card);
                } else {
                    console.error('Invalid listing format:', listing);
                }
            });
        } else {
            grid.innerHTML = '<p>No listings found for this user.</p>';
        }
    } catch (error) {
        console.error('Error fetching listings:', error);
        grid.innerHTML = '<p>Failed to load listings. Please try again later.</p>';
    }
});



// Initialize userData first, then fetch listings
retrieveData();

