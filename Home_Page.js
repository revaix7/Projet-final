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
/*
// Select a location and set it in the input field
function selectLocation(location) {
    const input = document.getElementById('location');
    input.value = location;  // Set the input's value to the selected location
    document.getElementById('location-dropdown').style.display = 'none'; // Hide the dropdown
}


let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
*/