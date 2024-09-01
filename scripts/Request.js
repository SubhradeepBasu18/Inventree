// import { getProducts } from './view-orders'; // Ensure the correct path
import { databases } from "../appwrite/app";
import { config } from "../appwrite/config";

async function getProducts(){
    try {
        const response = await databases.listDocuments(config.DATABASE_ID, config.PRODUCTS_COLLECTION_ID);

        if(response.documents.length > 0){
            const products = response.documents;
            console.log('Products:', products);
            return products;
        }
        else{
            console.log('No products found');
            return [];
        }

    } catch (error) {
        console.error('Failed to get products:', error);
        return [];
    }
}

async function displayProducts() {
    const products = await getProducts();
    console.log('Products:', products);

    if (products.length > 0) {
        const productNameDropdown = document.getElementById('productName');

        products.forEach(item => {
            const option = document.createElement('option');
            option.text = item.name;
            option.value = item.name;
            option.setAttribute('data-price', item.price);
            option.setAttribute('data-quantity',item.quantity);
            productNameDropdown.appendChild(option);
        });
    } else {
        console.log('No products available to display.');
    }
}

export function updatePrice(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.getAttribute('data-price');
    const quantityAvailable = selectedOption.getAttribute('data-quantity');

    document.getElementById('price').value = price;
    document.getElementById('availableQuantity').value = quantityAvailable;
}

function incDecBtn(){
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    const quantityInput = document.getElementById('quantity');

    incrementBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        const maxQuantity = parseInt(document.getElementById('availableQuantity').value, 10);
        if (currentQuantity < maxQuantity) {
            quantityInput.value = currentQuantity + 1;
        }
    });

    decrementBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value, 10);
        if (currentQuantity > 0) {
            quantityInput.value = currentQuantity - 1;
        }
    });
}

window.onload = () => {
    displayProducts();
    incDecBtn(); // Set up quantity buttons
};

window.updatePrice = updatePrice; // Ensure updatePrice is available globally