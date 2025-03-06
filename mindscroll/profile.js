document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".edit-btn").addEventListener("click", () => {
        alert("Edit Profile Clicked!");
    });

    document.querySelector(".share-btn").addEventListener("click", () => {
        alert("Profile Shared!");
    });

    // Bottom navigation active state
    const icons = document.querySelectorAll(".bottom-nav .icon");
    icons.forEach(icon => {
        icon.addEventListener("click", () => {
            icons.forEach(i => i.classList.remove("active"));
            icon.classList.add("active");
        });
    });
});
