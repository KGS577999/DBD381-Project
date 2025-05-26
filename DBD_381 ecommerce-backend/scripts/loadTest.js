// /scripts/loadTest.js
const axios = require('axios');

const URL = 'http://127.0.0.1:5000/api/products';

const generateTestProduct = (i) => ({
    name: `Test Product ${i}`,
    description: `PowerShell + load item #${i}`,
    category: 'CLI-Batch',
    price: parseFloat((9.99 + i).toFixed(2)),
    stock: 100 - i,
    images: []
});

const runLoadTest = async () => {
    const promises = [];
    for (let i = 1; i <= 50; i++) {
        const testData = generateTestProduct(i);
        promises.push(
            axios.post(URL, testData)
                .then(() => console.log(`✔ Product ${i} created`))
                .catch(err => console.error(`✘ Failed #${i}:`, err.response?.data || err.message))
        );
    }
    await Promise.all(promises);
    console.log('✅ Load test complete');
};
runLoadTest();
