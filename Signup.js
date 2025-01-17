const supabaseUrl = 'https://sxcbkodvcazqourcjxgn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io'; // Replace with your anon key

// Initialiser le client Supabase
let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    // Ajouter un écouteur d’événements au formulaire d’inscription
    document.getElementById('signup-form').addEventListener('submit', handleFormSubmit);
});

// Fonction de gestion de l’envoi de formulaires
async function handleFormSubmit(event, attempt = 1) {
    event.preventDefault();

    const submitButton = document.getElementById('submit-button'); // Accéder au bouton Soumettre par ID
    submitButton.disabled = true; // Permet d’activer le bouton pour éviter les soumissions multiples

    const { username, email, password, confirmPassword } = getFormData();

    // Validation améliorée des e-mails avec les TLD courants
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|co|io|edu|gov)$/;
    if (!emailRegex.test(email)) {
        displayError('Veuillez entrer une adresse e-mail valide avec un TLD courant.');
        submitButton.disabled = false; // Réactiver le bouton
        return;
    }

    if (password.length < 6) {
        displayError('Le mot de passe doit comporter au moins 6 caractères.');
        submitButton.disabled = false; // Réactiver le bouton
        return;
    }

    if (!validatePasswords(password, confirmPassword)) {
        displayError('Les mots de passe ne correspondent pas.');
        submitButton.disabled = false;
        return;
    }

    displayError(''); // Effacer les erreurs précédentes

    try {
        const uniqueId = generateUniqueId(); // Générer un ID unique pour l’utilisateur
        await saveUserToDatabase(username, email, password, uniqueId); // Enregistrer les détails de l’utilisateur dans la base de données (y compris le mot de passe et l’identifiant unique)
        alert('Inscription réussie! Veuillez vérifier votre e-mail pour confirmation.');
        window.location.href = 'Login.html'; // Rediriger vers la page de connexion
    } catch (error) {
        if (error.message === "email rate limit exceeded" && attempt < 4) { // Réessayez 3 fois maximum
            const delayTime = Math.pow(2, attempt) * 1000; // Recul exponentiel (1 s, 2 s, 4 s)
            displayError(`Trop de tentatives. Veuillez réessayer dans ${delayTime / 1000} secondes.`);
            await delay(delayTime); // Attendez un temps d’interruption exponentiel avant de réessayer
            handleFormSubmit(event, attempt + 1); // Réessayez l’envoi du formulaire
        } else {
            displayError('Quelque chose a mal tourné. Veuillez réessayer plus tard.');
            submitButton.disabled = false; // Bouton Réactiver si la limite de nouvelles tentatives est atteinte
        }
        console.error('Error during signup:', error);
    } finally {
        submitButton.disabled = false; // Réactivez le bouton après l’opération
    }
}

// Fonction permettant d’ajouter un délai (en millisecondes)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction permettant d’obtenir des données de formulaire
function getFormData() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    return { username, email, password, confirmPassword };
}

// FFonction permettant de générer un identifiant unique
function validatePasswords(password, confirmPassword) {
    return password === confirmPassword;
}

// Function to generate a unique ID
function generateUniqueId() {
    // Générer un ID unique basé sur le timestamp actuel et une chaîne aléatoire
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); 
}

// Fonction d’enregistrement des données de l’utilisateur dans la base de données (y compris le mot de passe et l’identifiant unique)
async function saveUserToDatabase(username, email, password, uniqueId) {
    const { data, error } = await supabaseClient
        .from('Compte')
        .insert([{ username, email, password, unique_id: uniqueId }]); // Stockez le nom d’utilisateur, l’adresse e-mail, le mot de passe et unique_id dans la base de données

    
    if (error) throw new Error('Database error saving new user: ' + error.message);
    console.log('User saved to database:', data); // Enregistrer éventuellement les données enregistrées
}

// Fonction d’affichage des messages d’erreur
function displayError(message) {
    document.getElementById('error-message').textContent = message;
}
