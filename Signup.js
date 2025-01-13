const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co'; // Replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

// Initialize Supabase client
let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to the signup form
    document.getElementById('signup-form').addEventListener('submit', handleFormSubmit);
});

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const { username, email, password, confirmPassword } = getFormData();

    // Check if password is at least 6 characters
    if (password.length < 6) {
        displayError('Le mot de passe doit comporter au moins 6 caractères.');
        return;
    }

    if (!validatePasswords(password, confirmPassword)) {
        displayError('Les mots de passe ne correspondent pas.');
        return;
    }

    displayError(''); // Clear previous errors

    try {
        const user = await signUpUser(email, password); // Sign up user
        await saveUserToDatabase(user.id, username, email); // Save user details and ID to DB
        alert('Inscription réussie! Veuillez vérifier votre e-mail pour confirmation.');
        window.location.href = 'Login.html'; // Redirect to login page
    } catch (error) {
        console.error('Error during signup:', error);
        displayError(error.message || 'Quelque chose a mal tourné. Veuillez réessayer plus tard.');
    }
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

// Function to sign up the user
async function signUpUser(email, password) {
    const { user, error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
        if (error.status === 429) {
            // Handle rate limiting (429 error)
            throw new Error('Trop de demandes. Veuillez réessayer après 42 secondes.');
        } else {
            // Handle other types of errors
            throw new Error(error.message);
        }
    }

    return user; // Return user for further processing
}

// Function to save user details in the database
async function saveUserToDatabase(userId, username, email) {
    const { data, error } = await supabaseClient
        .from('Compte') // Ensure this is the correct table name
        .insert([{ id: userId, username, email }]); // Insert the Supabase-generated user ID, username, and email
    
    if (error) throw new Error('Database error saving new user: ' + error.message);
    console.log('User saved to database:', data); // Optionally log the saved data
}

// Function to display error messages
function displayError(message) {
    document.getElementById('error-message').textContent = message;
}
