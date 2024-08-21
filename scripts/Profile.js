import { account, databases } from "../appwrite/app.js";
import { config } from "../appwrite/config.js"
import { Query } from "appwrite";



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
                
            })
            .catch(error => {
                console.error('Failed to fetch account details:', error);
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
                profileRole.textContent = document.role;
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

    displayLogin();
    getAccount();
});
