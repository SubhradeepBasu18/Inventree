import './sidebar.js';
import './Profile.js';
import './Signout.js';
import { account } from "../../appwrite/app";

async function checkSession() {
    try {
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

document.addEventListener('DOMContentLoaded', async () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');


    const isLoggedIn = await checkSession();
    console.log('In gayab wala function in main.js is logged in: ', isLoggedIn);
    
    if(isLoggedIn){
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    }
    else{
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});
