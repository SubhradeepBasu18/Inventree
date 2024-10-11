import { Query } from "appwrite";
import { account, databases } from "../appwrite/app.js";
import { config } from "../appwrite/config.js";

function showModal(message) {
    const modal = document.getElementById('customModal');
    const closeButton = document.querySelector('.close');
    const modalMessage = document.getElementById('modalMessage');

    // Set the message in the modal
    modalMessage.textContent = message;

    // Display the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks on the close button
    closeButton.onclick = function () {
        modal.style.display = 'none';
    };

    // Close the modal when the user clicks outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function handleLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const selectedRole = document.querySelector('input[name="role"]:checked')?.value;

        if (!email || !password || !selectedRole) {
            console.error('Please fill in all fields.');
            return;
        }

        console.log('Login Details:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Role:', selectedRole);

        account.createEmailPasswordSession(email, password)
            .then(response => {
                console.log('Login successful:', response);
                checkUserRoleAndRedirect();
            })
            .catch(error => {
                showModal('Login failed! Please check your credentials and try again.');
                console.error('Login failed:', error);
            });

        loginForm.reset();
    });
}

async function checkUserRoleAndRedirect() {
    try {
        const userRoleData = await getAccount();
        if (userRoleData) {
            if (userRoleData.role === 'admin') {
                console.log('User is an admin');
                showModal('Welcome Admin!'); // Display a welcome message
                // window.location.href = '../index.html'; // Redirect to the admin dashboard
            } else {
                console.log('User is a regular user');
                showModal('Welcome User!'); // Display a welcome message
                // window.location.href = '../index.html'; // Redirect to the user dashboard
            }
        } else {
            console.error('User role data not found');
        }
    } catch (error) {
        console.error('Error checking user role and redirecting:', error);
    }
}

export async function getAccount() {
    try {
        const user = await account.get();
        const userId = user.$id;

        console.log('User ID:', userId);

        const response = await databases.listDocuments(
            config.DATABASE_ID,
            config.ACCOUNTS_COLLECTION_ID,
            [
                Query.equal('userId', userId)
            ]
        );

        if (response.total > 0) {
            const document = response.documents[0];
            console.log('User role:', document.role);
            return {
                userId: document.userId,
                role: document.role
            };
        } else {
            console.error('User document not found');
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch user role:', error);
        return null;
    }
}

export async function checkSession() {
    try {
        // Fetch the current user's account information
        const user = await account.get();
        console.log('User is logged in:', user);
        return true;
    } catch (error) {
        if (error.code === 401) {
            console.log('User is not logged in');
        } else {
            console.error('An error occurred while checking the session:', error);
        }
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleLogin();
    checkSession().then(isLoggedIn => {
        if (isLoggedIn) {
            console.log('User is already logged in, checking role...');
            checkUserRoleAndRedirect();
        }
    });
});
