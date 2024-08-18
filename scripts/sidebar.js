document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const closeBtn = document.getElementById('close-btn');
    const mainContent = document.getElementById('mainContent');
    const userlists = document.getElementById('user-lists');

    function toggleSidebar(open) {
        if (open) {
            sidebar.style.transform = 'translateX(0)';
            mainContent.classList.add('shifted');
            userlists.classList.add('shifted');
        } else {
            sidebar.style.transform = 'translateX(-100%)';
            mainContent.classList.remove('shifted');
            userlists.classList.remove('shifted');
        }
    }

    hamburger.addEventListener('click', () => toggleSidebar(true));
    closeBtn.addEventListener('click', () => toggleSidebar(false));
});