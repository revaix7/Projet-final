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
