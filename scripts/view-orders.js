import { databases } from "../appwrite/app";
import { config } from "../appwrite/config";

export async function getProducts(){
    try {
        const response = await databases.listDocuments(config.DATABASE_ID, config.PRODUCTS_COLLECTION_ID);

        if(response.documents.length > 0){
            const products = response.documents;
            console.log('Products:', products);
            renderProductCards(products);
        }
        else{
            console.log('No products found');
        }

    } catch (error) {
        console.error('Failed to get products:', error);
    }
}

function renderProductCards(products){
    const container = document.querySelector('.order-cards');
    container.innerHTML = '';

    products.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('order-card');

        card.innerHTML = `
            <div class="product-info">
                <div class="product-name">${item.name}</div>
                <div class="product-quantity">Quantity: ${item.quantity}</div>
                <div class="product-price">$${item.price}</div>
            </div>
        `
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getProducts();
})