document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".bottom-nav .icon");

    icons.forEach(icon => {
        icon.addEventListener("click", () => {
            icons.forEach(i => i.classList.remove("active"));
            icon.classList.add("active");
        });
    });
});
