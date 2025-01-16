// Filter the dropdown items based on the input text
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

// Select a location and set it in the input field
function selectLocation(location) {
    const input = document.getElementById('location');
    input.value = location;  // Set the input's value to the selected location
    document.getElementById('location-dropdown').style.display = 'none'; // Hide the dropdown
}

//slides pour maisons
let slideIndex = [1,4];
/* Class the members of each slideshow group with different CSS classes */
let slideId = ["mySlides1", "mySlides2","mySlides3","mySlides4"]
showSlides(1, 0);
showSlides(1, 1);
showSlides(1, 2);
showSlides(1, 3);

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  let i;
  let x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex[no]-1].style.display = "block";
}

//like events
document.addEventListener("DOMContentLoaded", function () {
  const likeButton = document.querySelector(".Like");

  likeButton.addEventListener("click", function () {
      const heartIcon = likeButton.querySelector(".heart-icon");

      // Toggle the "filled" class on the heart icon
      if (heartIcon.classList.contains("filled")) {
          heartIcon.classList.remove("filled");
          heartIcon.textContent = "♡"; // Outlined heart
      } else {
          heartIcon.classList.add("filled");
          heartIcon.textContent = "♥"; // Filled heart
      }
  });
});
