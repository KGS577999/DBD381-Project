// /scripts/checkAdminToken.js
const jwt = require('jsonwebtoken');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Paste JWT token to check: ', (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'admin') {
            console.log('\n✅ Token belongs to an admin user');
        } else {
            console.log(`\n⚠ Token is valid, but role is '${decoded.role}'`);
        }
        console.log('\nDecoded Payload:', decoded);
    } catch (err) {
        console.error('\n❌ Invalid token:', err.message);
    } finally {
        rl.close();
    }
});
