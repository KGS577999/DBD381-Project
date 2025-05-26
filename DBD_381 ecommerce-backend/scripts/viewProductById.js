// /scripts/viewProductById.js
const axios = require('axios');
const readline = require('readline');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const BASE_URL = 'http://127.0.0.1:5000/api/products';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let products = [];
let TOKEN = '';

const listProducts = async () => {
    try {
        const { data } = await axios.get(BASE_URL, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        if (!data.length) {
            console.log(chalk.yellow('\n⚠ No products found in the database.'));
            rl.close();
            process.exit(0);
        }
        products = data;
        console.log(chalk.bold('\nAvailable Products:'));
        data.forEach((p, i) => {
            console.log(
                chalk.cyan(`${i + 1}.`) + ' ' +
                chalk.green(p.name) + ' - ' +
                chalk.dim(p._id)
            );
        });
    } catch (err) {
        console.error(chalk.red('❌ Failed to list products:'), err.response?.data || err.message);
        rl.close();
        process.exit(1);
    }
};

const showOptions = async (product) => {
    console.log(chalk.blue('\nChoose an action:'));
    console.log(chalk.cyan('1.') + ' Delete record');
    console.log(chalk.cyan('2.') + ' Edit record');
    console.log(chalk.cyan('3.') + ' Exit');

    rl.question(chalk.yellow('\nSelect option (1, 2, or 3): '), async (opt) => {
        if (opt === '1') {
            try {
                await axios.delete(`${BASE_URL}/${product._id}`, {
                    headers: { Authorization: `Bearer ${TOKEN}` }
                });
                console.log(chalk.green('🗑 Product deleted successfully.'));
            } catch (err) {
                console.error(chalk.red('❌ Delete failed:'), err.response?.data || err.message);
            } finally {
                rl.close();
            }
        } else if (opt === '2') {
            rl.question(chalk.yellow('Enter field to update (name, price, stock, description): '), (field) => {
                rl.question(chalk.yellow(`Enter new value for ${field}: `), async (value) => {
                    let payload = {};
                    if (field === 'price' || field === 'stock') {
                        payload[field] = parseFloat(value);
                    } else {
                        payload[field] = value;
                    }
                    try {
                        const { data } = await axios.put(`${BASE_URL}/${product._id}`, payload, {
                            headers: { Authorization: `Bearer ${TOKEN}` }
                        });
                        console.log(chalk.green('\n✅ Product updated successfully:'));
                        console.log(chalk.gray(JSON.stringify(data, null, 2)));
                    } catch (err) {
                        console.error(chalk.red('❌ Update failed:'), err.response?.data || err.message);
                    } finally {
                        rl.close();
                    }
                });
            });
        } else {
            console.log(chalk.gray('👋 Exiting...'));
            rl.close();
        }
    });
};

const getProductByIndex = async (index) => {
    const product = products[index - 1];
    if (!product) {
        console.error(chalk.red('❌ Invalid number selected'));
        rl.close();
        return;
    }
    try {
        const { data } = await axios.get(`${BASE_URL}/${product._id}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log(chalk.bold('\n📦 Product Details:'));
        console.log(chalk.gray(JSON.stringify(data, null, 2)));
        await showOptions(product);
    } catch (err) {
        console.error(chalk.red('❌ Failed to fetch product:'), err.response?.data || err.message);
        rl.close();
    }
};

rl.question(chalk.cyan('Paste your JWT token: '), async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            console.error(chalk.red('\n⛔ Access denied: You must be an admin to manage products.'));
            rl.close();
            return;
        }
        TOKEN = token;
        await listProducts();
        rl.question(chalk.cyan('\nEnter product number to view: '), async (num) => {
            const index = parseInt(num);
            if (isNaN(index) || index < 1 || index > products.length) {
                console.error(chalk.red('❌ Please enter a valid number.'));
                rl.close();
            } else {
                await getProductByIndex(index);
            }
        });
    } catch (err) {
        console.error(chalk.red('\n❌ Error:'), err.message);
        rl.close();
    }
});
