import { databases } from '../appwrite/app.js';
import { config } from '../appwrite/config.js';

export function addSale(productId, date, quantitySold, totalPrice) {
    const salesData = {
        productId: productId,
        date: date,
        quantitySold: quantitySold,
        totalPrice: totalPrice
    };

    databases.createDocument(config.SALES_COLLECTION_ID, 'unique()', salesData)
        .then(response => {
            console.log('Sale recorded:', response);
        })
        .catch(error => {
            console.error('Failed to record sale:', error);
        });
}
