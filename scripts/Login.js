import { client, account } from "../appwrite/app.js";

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

        const promise = account.createEmailPasswordSession(email, password);

        promise.then(function (response) {
            console.log('Login successful:', response); // Success

            if (response.selectedRole === 'admin') {
                console.log('Admin logged in');
                // Redirect to admin page

            } else {
                console.log('User logged in');
                // Redirect to user page
                window.location.href = '../index.html';
            }
        }).catch(function (error) {
            console.error('Login failed:', error); // Failure
        });

        loginForm.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleLogin();
});
