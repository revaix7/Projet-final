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
x