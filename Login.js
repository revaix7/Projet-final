const supabaseUrl = "https://sxcbkodvcazqourcjxgn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Jrb2R2Y2F6cW91cmNqeGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjUxMzksImV4cCI6MjA1MTg0MTEzOX0.XW1CCPWVH_me3oPdpdXDqjgKrNTesLqBqg28WwwX4io";

// Create the Supabase client
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


const email = document.getElementById("email");
const password = document.getElementById("password");
const button = document.querySelector("button");

// Function to handle user login using Supabase Auth
const handleLogin = async (event) => {
  event.preventDefault();  // Prevent form from submitting the default way

  // Make sure email and password are provided
  if (!email.value || !password.value) {
    alert("Veuillez remplir les deux champs !");
    return;
  }

  try {
    // Call Supabase to sign in the user
    const { data, error } = await supabaseClient
        .from('Compte')
        .select('*')
        .eq('email', email.value)
        .eq('password', password.value);

    // Handle the response from Supabase
    if (error) {
      console.error("Erreur lors de la connexion:", error.message);
      alert("E-mail ou mot de passe incorrect");
    } else {
      // User found and authenticated successfully
      window.location = "Home.html"; // Redirect to the home page
    }
  } catch (err) {
    console.error("Error during login:", err);
    alert(`Une erreur s'est produite: ${err.message}`);
  }
};

// Attach the login handler to the button click event
button.addEventListener("click", handleLogin);

