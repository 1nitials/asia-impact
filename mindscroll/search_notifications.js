document.addEventListener("DOMContentLoaded", () => {
    // Search functionality
    const searchBar = document.querySelector(".search-bar");
    const searchResults = document.querySelector(".search-results");
    
    if (searchBar) {
        searchBar.addEventListener("input", () => {
            const query = searchBar.value.toLowerCase();
            const items = document.querySelectorAll(".result-item");
            
            items.forEach(item => {
                if (item.textContent.toLowerCase().includes(query)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
    
    // Notifications functionality
    const notifications = document.querySelectorAll(".notification-item");
    
    notifications.forEach(notification => {
        notification.addEventListener("click", () => {
            notification.classList.remove("unread");
        });
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