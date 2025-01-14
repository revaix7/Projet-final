// Initialize Supabase client
const { createClient } = supabase; // This ensures the supabase object is available

const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

// Initialize Supabase client
let supabaseClient = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to the login form
    document.querySelector('form').addEventListener('submit', handleLoginFormSubmit);
});

// Function to handle form submission
async function handleLoginFormSubmit(event) {
    event.preventDefault();

    const submitButton = document.querySelector('.login-btn'); // Access the submit button
    submitButton.disabled = true; // Disable the button to prevent multiple submissions

    const { email, password } = getFormData();

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|co|io|edu|gov)$/;
    if (!emailRegex.test(email)) {
        displayError('Veuillez entrer une adresse e-mail valide.');
        submitButton.disabled = false; // Re-enable button if invalid email
        return;
    }

    if (password.length < 6) {
        displayError('Le mot de passe doit comporter au moins 6 caractères.');
        submitButton.disabled = false; // Re-enable button if invalid password
        return;
    }

    displayError(''); // Clear previous errors

    try {
        const user = await signInUser(email, password); // Sign in user using Supabase auth
        if (user) {
            // Fetch user details from the 'Compte' table to get the 'unique_id'
            const uniqueId = await fetchUniqueId(email);
            if (uniqueId) {
                alert('Connexion réussie!');
                window.location.href = `Dashboard.html?unique_id=${uniqueId}`; // Redirect to the user dashboard with unique_id
            } else {
                displayError('Aucun utilisateur trouvé avec cet e-mail.');
            }
        } else {
            displayError('E-mail ou mot de passe incorrect.');
        }
    } catch (error) {
        displayError('Quelque chose a mal tourné. Veuillez réessayer.');
        console.error('Error during login:', error);
    } finally {
        submitButton.disabled = false; // Re-enable the button after the operation
    }
}

// Function to get form data
function getFormData() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    return { email, password };
}

// Function to sign in the user with Supabase Auth
async function signInUser(email, password) {
    const { user, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('Error during sign-in:', error);
        return null; // Return null if authentication fails
    }

    return user; // Return user if authentication succeeds
}

// Function to fetch unique_id from the 'Compte' table based on email
async function fetchUniqueId(email) {
    const { data, error } = await supabaseClient
        .from('Compte')
        .select('unique_id') // Select the unique_id column
        .eq('email', email)  // Filter by the email provided
        .single(); // We expect only one result

    if (error) {
        console.error('Error fetching unique_id:', error);
        return null; // Return null if an error occurs
    }

    return data?.unique_id; // Return the unique_id
}

// Function to display error messages
function displayError(message) {
    const errorMessageElement = document.querySelector('.error-message');
    if (!errorMessageElement) {
        const newErrorMessageElement = document.createElement('p');
        newErrorMessageElement.classList.add('error-message');
        newErrorMessageElement.style.color = 'red';
        newErrorMessageElement.textContent = message;
        document.querySelector('.login-form').appendChild(newErrorMessageElement);
    } else {
        errorMessageElement.textContent = message;
    }
}
