import { account, databases } from "../appwrite/app.js";
import { config } from "../appwrite/config.js";
import { Query } from "appwrite";

async function getAccountDetails() {
    try {
        const user = await account.get();
        const userId = user.$id;

        const response = await databases.listDocuments(
            config.DATABASE_ID,
            config.ACCOUNTS_COLLECTION_ID,
            [Query.equal('userId', userId)]
        );

        if (response.total > 0) {
            const document = response.documents[0];
            return {
                userId: document.userId || null,
                role: document.role || null,
                name: user.name || document.name || "N/A",
                email: user.email || document.email || "N/A"
            };
        } else {
            console.error('User not found in database');
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch user details:', error);
        return null;
    }
}

async function displayUserDetails(nameElement, profileNameElement, profileEmailElement, profileRoleElement) {
    const accountDetails = await getAccountDetails();
    console.log('Account Details:', accountDetails);
    
    if (accountDetails) {
        nameElement.textContent = `Hi, ${accountDetails.name || "N/A"}`;
        profileNameElement.textContent = `${accountDetails.name || "N/A"}`;
        profileEmailElement.textContent = `${accountDetails.email || "N/A"}`;
        profileRoleElement.innerHTML = `${accountDetails.role || "N/A"}`;
    } else {
        console.error('No account details found.');
    }
}



document.addEventListener('DOMContentLoaded', async () => {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileRole = document.getElementById('profile-role');
    const name = document.getElementById('name');

    if (!profileName || !profileEmail || !profileRole || !name) {
        console.error('One or more profile elements not found.');
        return;
    }

    await displayUserDetails(name, profileName, profileEmail, profileRole);
});

export { getAccountDetails, displayUserDetails };
