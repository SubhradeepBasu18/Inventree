import { account } from "../../appwrite/app.js";

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            account.deleteSession('current')
                .then(() => {
                    console.log('User logged out successfully');
                    alert('You have been logged out successfully!');
                    window.location.href = '../index.html';
                })
                .catch(error => {
                    showModal('Failed to logout! Please try again.');
                    console.error('Failed to logout:', error);
                });
        });
    } else {
        console.error('Logout button not found!');
    }
});
