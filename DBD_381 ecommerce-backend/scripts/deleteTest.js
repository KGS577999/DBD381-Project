// /scripts/deleteTest.js
const axios = require('axios');

const URL = 'http://127.0.0.1:5000/api/products';

const cleanupTestProducts = async () => {
    try {
        const response = await axios.get(URL);
        const testProducts = response.data.filter(p => p.name.startsWith('Test Product'));

        for (const product of testProducts) {
            await axios.delete(`${URL}/${product._id}`);
            console.log(`🗑 Deleted ${product.name}`);
        }
        console.log('✅ Cleanup complete');
    } catch (err) {
        console.error('Cleanup failed:', err.response?.data || err.message);
    }
};

cleanupTestProducts();
