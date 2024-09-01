import './charts.js';
import './sidebar.js';
import './Profile.js';
import './Signout.js';
import { account} from "../appwrite/app.js";

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
    

    const isLoggedIn = await checkSession();
    console.log('is logged in:', isLoggedIn);
    
    if(isLoggedIn){
        loginBtn.style.display = 'none';
    }
    else{
        loginBtn.style.display = 'block';
    }


});
