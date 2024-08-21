import './charts.js';
import './sidebar.js';
import { addProduct, getProducts } from './products.js';
import './Profile.js'
import './Signout.js'

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    const quantityInput = document.getElementById('quantity');

    incrementBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        quantityInput.value = currentQuantity + 1;
    });

    decrementBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        if (currentQuantity > 0) {
            quantityInput.value = currentQuantity - 1;
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('productName').value.trim();
        const productPrice = parseFloat(document.getElementById('productPrice').value);
        const quantity = parseInt(quantityInput.value, 10);

        if (!productName || isNaN(productPrice) || isNaN(quantity)) {
            console.error('Invalid input. Please enter valid product details.');
            return;
        }

        console.log('Adding product:', productName, productPrice, quantity);
        addProduct(productName, productPrice, quantity);

        form.reset();
        quantityInput.value = 0;
    });
});
