// /scripts/orderTest.js
const axios = require('axios');

const API_URL = 'http://localhost:3000/orders';

const testOrder = async () => {
    try {
        // Create an order
        const createRes = await axios.post(API_URL, {
            userId: 'USER_ID_HERE',
            orderItems: [
                { productId: 'PRODUCT_ID_1', quantity: 2 },
                { productId: 'PRODUCT_ID_2', quantity: 1 }
            ],
            shippingAddress: '123 Test St'
        });
        console.log('Created Order:', createRes.data);

        const orderId = createRes.data._id;

        // Get all orders
        const allRes = await axios.get(API_URL);
        console.log('All Orders:', allRes.data);

        // Get specific order
        const oneRes = await axios.get(`${API_URL}/${orderId}`);
        console.log('Order By ID:', oneRes.data);

        // Update order status
        const updateRes = await axios.patch(`${API_URL}/${orderId}`, {
            status: 'Shipped'
        });
        console.log('Updated Order:', updateRes.data);

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
};

testOrder();
