// Initialize Supabase
const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key
let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
// Reference the grid where listings will be inserted
const grid = document.getElementById('listingGrid');
let parsedData = null;
let userData = null;

function retrieveData() {
    // Retrieve the data from localStorage using the same key ('user')
    const storedUserData = localStorage.getItem('user');
    
    // Ensure the data exists in localStorage
    if (storedUserData) {
        // Parse the JSON string back into an object
        userData = JSON.parse(storedUserData);  // Update the global variable

        // Debugging log to check the structure of userData
        console.log("Retrieved user data:", userData);  // Debugging log

        // Access and use user data here
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            // Example: Display the username on the page
            userInfoDiv.innerHTML = `Username: ${userData.username}`;
        }
    } else {
        // If no data found in localStorage
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 'No user data found in localStorage.';
        }
    }
}


async function fetchListings() {
    const username = userData.username;  // Accessing username from userData
    try {
        const { data, error } = await supabaseClient
            .from('Compte') // Ensure this is your table name
            .select('*') // Fetch all columns
            .select("newListing")
            .eq('username', username); // Filter by username
        if (error) throw error;

        // Clear the grid before injecting new listings
        grid.innerHTML = '';
         
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((user) => {
                // Parse the 'newListing' field
                const listings = JSON.parse(user.newListing);
                console.log(listings)
                // Iterate over the listings inside 'newListing'
                data.forEach(() => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    // Fallback for missing image URLs
                    const imageUrl = listings.image || 'https://via.placeholder.com/150';
                    card.innerHTML = `
                        <img src="${imageUrl}" alt="Property Image">
                        <div class="card-content">
                            <h3>${listings.title}</h3>
                            <p>${listings.location || 'No location available'}</p>
                            <p class="price">$${listings.price}</p>
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
retrieveData();

// Call the function to fetch and generate listings when the page loads
fetchListings();