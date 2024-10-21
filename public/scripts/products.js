import { account, databases } from "../appwrite/app.js";
import { config } from '../appwrite/config.js';
import { checkSession, getAccount } from './Login.js';

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

export function addProduct(name, price, quantity,userId) {
    const productData = {
        name: name,
        price: price,
        quantity: quantity,
    };

    databases.createDocument(config.DATABASE_ID,config.PRODUCTS_COLLECTION_ID, 'unique()', productData)
        .then(response => {
            console.log(`${userId} added Product :`, response);
        })
        .catch(error => {
            console.error('Failed to add product:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');  
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    const quantityInput = document.getElementById('quantity');

    incrementBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        quantityInput.value = currentQuantity + 1;
    });

    // Decrement button handler
    decrementBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        if (currentQuantity > 0) {
            quantityInput.value = currentQuantity - 1;
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const productName = document.getElementById('productName').value.trim();
        const productPrice = parseFloat(document.getElementById('productPrice').value);
        const quantity = parseInt(quantityInput.value, 10);
        if (!productName || isNaN(productPrice) || isNaN(quantity)) {
            console.error('Invalid input. Please enter valid product details.');
            return;
        }

        // Check if the user is logged in
        // const isLoggedIn = await checkSession();
        const isLoggedIn = await checkSession();
        if (!isLoggedIn) {
            showModal('Please login to add products');
            return;
        }

        // Get the user's role
        const userAccount = await getAccount();
        console.log('User account:', userAccount);
        
        if (!userAccount) {
            showModal('Failed to retrieve user account information');
            return;
        }

        const role = userAccount.role;
        console.log('User role before adding to database:', role);
        
        if (role === 'admin') {
            console.log('Adding product:', productName, productPrice, quantity);
            addProduct(productName, productPrice, quantity,userAccount.$id);
            showModal('Product added successfully');
        } else {
            showModal('You are not authorized to add products');
        }
        // addProduct(productName, productPrice, quantity);

        form.reset();
        quantityInput.value = 0;
    });
})
