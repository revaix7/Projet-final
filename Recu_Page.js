// Initialize Supabase
const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Reference the grid where listings will be inserted
const grid = document.getElementById('listingGrid');
const username = "as2"; // Use the username for the user you're querying

async function fetchListings() {
    try {
        const { data, error } = await supabaseClient
            .from('Compte') // Ensure this is your table name
            .select('*') // Fetch all columns
            .eq('username', username); // Filter by username

        if (error) throw error;

        // Clear the grid before injecting new listings
        grid.innerHTML = '';

        if (Array.isArray(data) && data.length > 0) {
            data.forEach((user) => {
                // Parse the 'newListing' field
                const listings = JSON.parse(user.newListing);

                // Iterate over the listings inside 'newListing'
                listings.forEach((listing) => {
                    const card = document.createElement('div');
                    card.className = 'card';

                    // Fallback for missing image URLs
                    const imageUrl = listing.image || 'https://via.placeholder.com/150';

                    card.innerHTML = `
                        <img src="${imageUrl}" alt="Property Image">
                        <div class="card-content">
                            <h3>${listing.title}</h3>
                            <p>${listing.location || 'No location available'}</p>
                            <p class="price">$${listing.price.toFixed(2)}</p>
                        </div>
                    `;

                    // Append the card to the grid
                    grid.appendChild(card);
                });
            });
        } else {
            grid.innerHTML = '<p>No listings found for this user.</p>';
        }
    } catch (error) {
        console.error('Error fetching listings:', error);
        grid.innerHTML = '<p>Failed to load listings. Please try again later.</p>';
    }
}

// Call the function to fetch and generate listings when the page loads
fetchListings();

