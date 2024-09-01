import { account,databases } from '../appwrite/app.js';
import { config } from '../appwrite/config.js';
import { checkSession, getAccount } from './Login.js';

export function addProduct(name, price, quantity) {
    const productData = {
        name: name,
        price: price,
        quantity: quantity
    };

    databases.createDocument(config.DATABASE_ID,config.PRODUCTS_COLLECTION_ID, 'unique()', productData)
        .then(response => {
            console.log('Product added:', response);
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
            alert('Please login to add products');
            return;
        }

        // Get the user's role
        const userAccount = await getAccount();
        if (!userAccount) {
            alert('Failed to retrieve user account information');
            return;
        }

        const role = userAccount.role;
        console.log('User role before adding to database:', role);
        
        if (role === 'admin') {
            console.log('Adding product:', productName, productPrice, quantity);
            addProduct(productName, productPrice, quantity);
            alert('Product added successfully');
        } else {
            alert('You are not authorized to add products');
        }
        // addProduct(productName, productPrice, quantity);

        form.reset();
        quantityInput.value = 0;
    });
})
