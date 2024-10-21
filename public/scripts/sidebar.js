document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const closeBtn = document.getElementById('close-btn');
    const mainContent = document.querySelector('.content');

    function toggleSidebar() {
        if (sidebar.style.transform === 'translateX(0%)') {
            sidebar.style.transform = 'translateX(-100%)'; // Close the sidebar
            mainContent.classList.remove('shifted'); // Remove shifted content
        } else {
            sidebar.style.transform = 'translateX(0%)'; // Open the sidebar
            mainContent.classList.add('shifted'); // Shift content
        }
    }

    hamburger.addEventListener('click', toggleSidebar); // Toggle sidebar on hamburger click
    closeBtn.addEventListener('click', toggleSidebar); // Optionally allow closing via the close button
});
