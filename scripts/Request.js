import { databases } from "../appwrite/app";
import { config } from "../appwrite/config";
import { getAccountDetails } from "./Profile.js";

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

// Example usage:
// showModal("Your operation was completed successfully!");


const productForm = document.getElementById('productForm');

async function handleRequests(event){

    const productName = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    event.preventDefault();
    console.log('Product details:', productName, price, quantity);
    
    if (!productName || isNaN(price) || isNaN(quantity)) {
        console.error('Invalid input. Please enter valid product details.');
        return;
    }

    const accountDetails = await getAccountDetails();

    const productData = {
        name: productName,
        price: price,
        quantity: quantity,
        userId: accountDetails.userId
    };

    databases.createDocument(config.DATABASE_ID,config.SALES_COLLECTION_ID, 'unique()', productData)
        .then(response => {
            console.log('Product added:', response);
            showModal('Product added successfully!');
        })
        .catch(error => {
            console.error('Failed to add product:', error);
            showModal('Failed to add product. Please try again.');
        });
}

productForm.addEventListener('submit', handleRequests);

window.onload = () => {
    displayProducts();
    incDecBtn();
};

window.updatePrice = updatePrice; // Ensure updatePrice is available globally
