// URL et clé Supabase
const supabaseUrl = "https://sxcbkodvcazqourcjxgn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io";

// Création du client Supabase
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Obtenir l’e-mail, le mot de passe et les éléments du bouton
const email = document.getElementById("email");
const password = document.getElementById("password");
const button = document.querySelector("button");

////// Function to handle user login
const handleLogin = async (event) => {
  event.preventDefault();  // Empêcher l’envoi du formulaire par défaut

  // Assurez-vous que l’adresse e-mail et le mot de passe sont fournis
  if (!email.value || !password.value) {
    alert("Veuillez remplir les deux champs !");
    return;
  }

  try {
    // Call Supabase to sign in the user
    const { data, error } = await supabaseClient
      .from('Compte')
      .select('unique_id, email, username')  // Ne sélectionnez que les champs dont nous avons besoin
      .eq('email', email.value)
      .eq('password', password.value)
      .single();  // Récupérer une seule ligne, en supposant que l’adresse e-mail/le mot de passe est unique

    // Gérer la réponse de Supabase
    if (error) {
      console.error("Erreur lors de la connexion:", error.message);
      alert("E-mail ou mot de passe incorrect");
    } else {
      // utilisateur trouvé et authentifié avec succès
      storeData(data);  // Transmettre les données à stocker dans localStorage
      window.location = "Home.html"; // Rediriger vers la page d’accueil
    }
  } catch (err) {
    console.error("Error during login:", err);
    alert(`Une erreur s'est produite: ${err.message}`);
  }
};



//////// Fonction de stockage des données dans localStorage
function storeData(user) {
    localStorage.clear();//----------------------------------------------------------
    // Assurez-vous que l’objet utilisateur contient les propriétés attendues
    console.log("Storing data:", user); // log de débogage

    // Stocker les données utilisateur dans localStorage (unique_id, e-mail et nom d’utilisateur)
    const userData = {
      unique_id: user.unique_id,
      email: user.email,
      username: user.username
    };

    // Stockez-le dans localStorage sous forme de chaîne JSON
    localStorage.setItem('user', JSON.stringify(userData));

    alert('Data has been stored in localStorage!');
    
}

// Attacher le gestionnaire de connexion à l’événement de clic sur le bouton
button.addEventListener("click", handleLogin);
