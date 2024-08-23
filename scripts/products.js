import { account,databases } from '../appwrite/app.js';
import { config } from '../appwrite/config.js';

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


export function getProducts() {
    databases.listDocuments(config.DATABASE_ID, config.PRODUCTS_COLLECTION_ID)
        .then(response => {
            console.log('Products:', response.documents);
        })
        .catch(error => {
            console.error('Failed to get products:', error);
        });
}