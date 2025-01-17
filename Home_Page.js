// Filtrer les éléments du menu déroulant en fonction du texte saisi
function filterLocations() {
  const input = document.getElementById('location');
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById('location-dropdown');
  const items = dropdown.getElementsByClassName('dropdown-item');

  for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const text = item.innerText.toLowerCase();
      if (text.includes(filter)) {
          item.style.display = 'flex';
      } else {
          item.style.display = 'none';
      }
  }
}

// Sélectionner un lieu et le définir dans le champ de saisie
function selectLocation(location) {
  const input = document.getElementById('location');
  input.value = location;  // Définir la valeur du champ de saisie avec le lieu sélectionné
  document.getElementById('location-dropdown').style.display = 'none'; // Masquer le menu déroulant
}

// Diaporama pour les maisons
let slideIndex = [1, 1, 1, 1, 1, 1, 1, 1];
let slideId = ["mySlides1", "mySlides2", "mySlides3", "mySlides4", "mySlides5", "mySlides6", "mySlides7", "mySlides8"];

document.addEventListener("DOMContentLoaded", function() {
    showSlides(1, 0);
    showSlides(1, 1);
    showSlides(1, 2);
    showSlides(1, 3);
    showSlides(1, 4);
    showSlides(1, 5);
    showSlides(1, 6);
    showSlides(1, 7);
});

function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
}

function currentSlide(n, no) {
    showSlides(slideIndex[no] = n, no);
}

function showSlides(n, no) {
    let i;
    let x = document.getElementsByClassName(slideId[no]);
    let dots = document.getElementsByClassName("dot" + no);

    if (x.length === 0 || dots.length === 0) {
        console.error("Elements not found for slide index:", slideIndex[no]);
        return;
    }

    if (n > x.length) { slideIndex[no] = 1 }
    if (n < 1) { slideIndex[no] = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    x[slideIndex[no] - 1].style.display = "block";
    dots[slideIndex[no] - 1].className += " active";
}

// Événements de clic sur le bouton "aimer"
document.addEventListener("DOMContentLoaded", function () {
const likeButton = document.querySelector(".Like");

likeButton.addEventListener("click", function () {
    const heartIcon = likeButton.querySelector(".heart-icon");

    // Basculer la classe "filled" sur l'icône du cœur
    if (heartIcon.classList.contains("filled")) {
        heartIcon.classList.remove("filled");
        heartIcon.textContent = "♡"; // Cœur non rempli
    } else {
        heartIcon.classList.add("filled");
        heartIcon.textContent = "♥"; // Cœur rempli
    }
});
});

// Fonction de déconnexion
function logout() {
  localStorage.clear();
  alert("Vous avez été déconnecté.");
}