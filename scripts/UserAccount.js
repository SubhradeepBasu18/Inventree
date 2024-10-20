import { Query } from "appwrite";
import { databases } from "../appwrite/app.js";
import { config } from "../appwrite/config.js";
import { getAccountDetails } from "./Profile.js";

async function getOrderDetails(userId) {
    console.log('Fetching order details for user:', userId);
    
    try {
        const response = await databases.listDocuments(
            config.DATABASE_ID,
            config.SALES_COLLECTION_ID,
            [Query.equal('userId', userId)]
        );

        console.log('Fetched documents:', response.documents);
        return response.documents;
    } catch (error) {
        console.error('Failed to fetch requested products:', error);
        throw new Error('Could not retrieve requested products.');
    }
}

document.addEventListener('DOMContentLoaded', async () => { 
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const orderTableBody = document.querySelector('.order-history tbody'); // Reference to the table body

    try {
        const accountDetails = await getAccountDetails();
        const orders = await getOrderDetails(accountDetails.userId); // Wait for orders

        if (accountDetails) {
            const role = accountDetails.role;
            if(role === 'admin'){
                profileRole.innerHTML = `<strong>Role:</strong> Admin`;
            }
            else if(role === 'user'){
                profileRole.innerHTML = `<strong>Role:</strong> Customer`;
            }
            else{
                profileRole.innerHTML = `<strong>Role:</strong> N/A`;
            }
            profileName.innerHTML = `<strong>Name:</strong> ${accountDetails.name || "N/A"}`;
            profileEmail.innerHTML = `<strong>Email:</strong> ${accountDetails.email || "N/A"}`;
            
        } else {
            console.error('No account details found.');
        }

        // Populate the order history table
        if (orders && orders.length > 0) {
            orders.forEach(order => {
                const updatedAt = order.$updatedAt ? new Date(order.$updatedAt) : null;
                const formattedDate = updatedAt ? updatedAt.toISOString().split('T')[0] : "N/A";
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.$id || "N/A"}</td>
                    <td>${formattedDate || "N/A"}</td>
                    <td>${order.name || "N/A"}</td>
                    <td>${order.quantity || "N/A"}</td>
                    <td>${order.price || "N/A"}</td>
                    <td>${order.status || "N/A"}</td>
                `;
                orderTableBody.appendChild(row); // Append the row to the table body
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6">No orders found.</td>`;
            orderTableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error retrieving account details:', error);
    }
});
