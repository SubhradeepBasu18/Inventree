import { Query } from "appwrite";
import { account, databases } from "../appwrite/app.js";
import { config } from "../appwrite/config.js";

function handleLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const selectedRole = document.querySelector('input[name="role"]:checked')?.value;

        if (!email || !password || !selectedRole) {
            console.error('Please fill in all fields.');
            return;
        }
        console.log('Name:', name);        
        console.log('Login Details:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Role:', selectedRole);

        const promise = account.createEmailPasswordSession(email, password);

        promise.then(function (response) {
            console.log('Login successful:', response); // Success

            if (response.selectedRole === 'admin') {
                console.log('Admin logged in');
                // handleAcount();
                window.location.href = '../index.html';

            } else {
                console.log('User logged in');
                // handleAcount();
                window.location.href = '../index.html';
            }
        }).catch(function (error) {
            console.error('Login failed:', error); // Failure
        });

        loginForm.reset();
    });
}

async function getAccount(){
    try{
        const user = await account.get();
        const userId = user.$id;

        console.log('User ID:', userId);

        const response = await databases.listDocuments(
            config.DATABASE_ID,
            config.ACCOUNTS_COLLECTION_ID,
            [
                Query.equal('userId', userId)
            ]
        )

        if(response.total > 0){
            const document = response.documents[0];

            console.log('User role:', document.role);
            return{
                userId: document.userId,
                role: document.role
            };
        }else{
            console.error('User not found');
            return null;
        }
    }catch(error){
        console.error('Failed to fetch user role:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleLogin();
    // const result = account.get();
    // console.log(result);
    getAccount().then(userRoleData => {
        if (userRoleData) {
            console.log('User Role Data:', userRoleData);
            // Perform actions based on user role
            if (userRoleData.role === 'admin') {
                // Redirect to admin dashboard, etc.
                window.location.href = '../index.html';
                console.log('User is an admin');
            } else {
                // Redirect to user dashboard, etc.
                window.location.href = '../index.html';
                console.log('User is a regular user');
            }
        }
    });
});
