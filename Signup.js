const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

// Initialize Supabase client
let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to the signup form
    document.getElementById('signup-form').addEventListener('submit', handleFormSubmit);
});

// Function to handle form submission
async function handleFormSubmit(event, attempt = 1) {
    event.preventDefault();

    const submitButton = document.getElementById('submit-button'); // Access the submit button by ID
    submitButton.disabled = true; // Disable the button to prevent multiple submissions

    const { username, email, password, confirmPassword } = getFormData();

    // Enhanced email validation with common TLDs
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|co|io|edu|gov)$/;
    if (!emailRegex.test(email)) {
        displayError('Veuillez entrer une adresse e-mail valide avec un TLD courant.');
        submitButton.disabled = false; // Re-enable the button
        return;
    }

    if (password.length < 6) {
        displayError('Le mot de passe doit comporter au moins 6 caractères.');
        submitButton.disabled = false; // Re-enable the button
        return;
    }

    if (!validatePasswords(password, confirmPassword)) {
        displayError('Les mots de passe ne correspondent pas.');
        submitButton.disabled = false;
        return;
    }

    displayError(''); // Clear previous errors

    try {
        const uniqueId = generateUniqueId(); // Generate a unique ID for the user
        await saveUserToDatabase(username, email, password, uniqueId); // Save user details to DB (including password and unique ID)
        alert('Inscription réussie! Veuillez vérifier votre e-mail pour confirmation.');
        window.location.href = 'Login.html'; // Redirect to login page
    } catch (error) {
        if (error.message === "email rate limit exceeded" && attempt < 4) { // Retry max 3 times
            const delayTime = Math.pow(2, attempt) * 1000; // Exponential backoff (1s, 2s, 4s)
            displayError(`Trop de tentatives. Veuillez réessayer dans ${delayTime / 1000} secondes.`);
            await delay(delayTime); // Wait for exponential backoff time before retrying
            handleFormSubmit(event, attempt + 1); // Retry the form submission
        } else {
            displayError('Quelque chose a mal tourné. Veuillez réessayer plus tard.');
            submitButton.disabled = false; // Re-enable button if retry limit reached
        }
        console.error('Error during signup:', error);
    } finally {
        submitButton.disabled = false; // Re-enable the button after the operation
    }
}

// Function to add a delay (in milliseconds)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get form data
function getFormData() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    return { username, email, password, confirmPassword };
}

// Function to validate passwords
function validatePasswords(password, confirmPassword) {
    return password === confirmPassword;
}

// Function to generate a unique ID
function generateUniqueId() {
    // Generate a unique ID based on the current timestamp and a random string
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); 
}

// Function to save user details in the database (including password and unique ID)
async function saveUserToDatabase(username, email, password, uniqueId) {
    const { data, error } = await supabaseClient
        .from('Compte') // Ensure this is the correct table name
        .insert([{ username, email, password, unique_id: uniqueId }]); // Store username, email, password, and unique_id in your custom database
    
    if (error) throw new Error('Database error saving new user: ' + error.message);
    console.log('User saved to database:', data); // Optionally log the saved data
}

// Function to display error messages
function displayError(message) {
    document.getElementById('error-message').textContent = message;
}
