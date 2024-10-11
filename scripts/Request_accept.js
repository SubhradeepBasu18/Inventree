import { databases } from "../appwrite/app";
import { config } from "../appwrite/config";
import { getAccount } from "./Login";

// Fetch inventory requests from the database
async function getRequests() {
    try {
        const response = await databases.listDocuments(config.DATABASE_ID, config.SALES_COLLECTION_ID);

        if (response.documents.length > 0) {
            const products = response.documents;
            console.log('Products:', products);
            return products;
        } else {
            console.log('No products found');
            return [];
        }
    } catch (error) {
        console.error('Failed to get products:', error);
        return [];
    }
}

// Check if the user is an admin
function isAdmin(user) {
    return user.role === "admin";
}

async function handleAction(requestId, action) {
    const inventoryRequests = await getRequests();

    const request = inventoryRequests.find(req => req.$id === requestId);
    if (request) {
        request.status = action === 'accept' ? 'Accepted' : 'Rejected';

        try {
            await databases.updateDocument(
                config.DATABASE_ID,
                config.SALES_COLLECTION_ID,
                request.$id,
                { status: request.status }  
            );
            console.log(`Request ${requestId} has been ${request.status}`);
        } catch (error) {
            console.error('Failed to update request status:', error);
        }

        const updatedRequests = await getRequests(); 
        renderRequests(updatedRequests);
    }
}

async function renderRequests(requests) {
    const tableBody = document.querySelector("#request-table tbody");

    if (!tableBody) {
        console.error("Table body not found");
        return;
    }

    tableBody.innerHTML = "";

    requests.forEach(request => {
        const row = document.createElement("tr");

        const status = request.status ?? 'Pending';

        row.innerHTML = `
            <td>${request.$id}</td>
            <td>${request.name}</td>
            <td>${request.quantity}</td>
            <td>${request.price}</td>
            <td>${status}</td>
        `;

        if (status === 'Pending') {  
            const acceptButton = document.createElement("button");
            acceptButton.classList.add("action-btn", "accept-btn");
            acceptButton.textContent = "Accept";
            acceptButton.addEventListener("click", () => handleAction(request.$id, "accept"));

            const rejectButton = document.createElement("button");
            rejectButton.classList.add("action-btn", "reject-btn");
            rejectButton.textContent = "Reject";
            rejectButton.addEventListener("click", () => handleAction(request.$id, "reject"));

            const actionsCell = document.createElement("td");
            actionsCell.appendChild(acceptButton);
            actionsCell.appendChild(rejectButton);
            row.appendChild(actionsCell);
        } else {
            const actionsCell = document.createElement("td");
            actionsCell.textContent = status; 
            row.appendChild(actionsCell);
        }

        tableBody.appendChild(row);
    });
}

async function showPageForAdmin() {
    const currentUser = await getAccount();
    const adminSection = document.getElementById("admin-section");
    const noAccessSection = document.getElementById("no-access");
    const notLoggedOut = document.getElementById("not-loggedIn");

    if (!currentUser) {
        console.log("User not logged in");
        notLoggedOut.classList.remove("hidden");
        return;
    }

    if (isAdmin(currentUser)) {
        adminSection.classList.remove("hidden");

        const inventoryRequests = await getRequests();
        renderRequests(inventoryRequests);
    } else {
        noAccessSection.classList.remove("hidden");
    }
}
document.addEventListener("DOMContentLoaded", showPageForAdmin);
