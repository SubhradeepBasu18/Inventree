import { account } from "../appwrite/app.js";

document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileRole = document.getElementById('profile-role');
    const name = document.getElementById('name');

    function displayLogin() {
        account.get()
            .then(response => {
                console.log('Account details:', response);
                name.textContent = `Hi, ${response.name}`;
                profileName.textContent = response.name;
                profileEmail.textContent = response.email;
                // Assuming response has role data
                profileRole.textContent = response.role || 'User';
            })
            .catch(error => {
                console.error('Failed to fetch account details:', error);
            });
    }

    displayLogin();
});
