import './charts.js';
import './sidebar.js';
import { addProduct } from './products.js';
import './Profile.js';
import './Signout.js';
import { getAccount, checkSession } from './Login.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('productForm');
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    const quantityInput = document.getElementById('quantity');
    const loginBtn = document.getElementById('login-btn');

    const isLoggedIn = await checkSession();
    if(isLoggedIn){
        loginBtn.style.display = 'none';
    }
    else{
        loginBtn.style.display = 'block';
    }

    // Increment button handler
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

    // Form submission handler
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
        if (role === 'admin') {
            console.log('Adding product:', productName, productPrice, quantity);
            addProduct(productName, productPrice, quantity);
        } else {
            alert('You are not authorized to add products');
        }
        // addProduct(productName, productPrice, quantity);

        form.reset();
        quantityInput.value = 0;
    });

});
