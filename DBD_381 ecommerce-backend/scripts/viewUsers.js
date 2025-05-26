// /scripts/viewUsers.js
const axios = require('axios');
const readline = require('readline');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const ora = require('ora');
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const URL = 'http://127.0.0.1:5000/api/users';

rl.question(chalk.cyan('Paste your JWT token: '), async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            console.error(chalk.red('\n⛔ Access denied: You must be an admin to view users.'));
            rl.close();
            return;
        }

        const spinner = ora({
            text: 'Fetching user list...',
            spinner: 'dots'
        });

        spinner.start();

        setTimeout(async () => {
            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                await new Promise(resolve => setTimeout(resolve, 1000)); // spinner stays visible
                spinner.succeed('User list loaded.');

                const data = response.data;
                console.log(chalk.bold('\n👥 User List:'));
                data.forEach((user, i) => {
                    console.log(
                        chalk.white(`${i + 1}.`) + ' ' +
                        chalk.yellow(user.name) + ' | ' +
                        chalk.gray(user.email) + ' | ' +
                        chalk.magenta(`role: ${user.role}`) + ' | ' +
                        chalk.dim(`id: ${user._id}`)
                    );
                });

                rl.question(chalk.cyan('\nEnter user number to manage or press Enter to exit: '), async (num) => {
                    const index = parseInt(num);
                    if (!num) {
                        console.log(chalk.green('👋 Exiting...'));
                        rl.close();
                        return;
                    }
                    if (isNaN(index) || index < 1 || index > data.length) {
                        console.error(chalk.red('❌ Invalid number'));
                        rl.close();
                        return;
                    }

                    const selectedUser = data[index - 1];
                    console.log(`\nSelected: ${chalk.yellow(selectedUser.name)} (${chalk.gray(selectedUser.email)})`);
                    console.log(chalk.cyan('1. Edit role'));
                    console.log(chalk.cyan('2. Delete user'));
                    console.log(chalk.cyan('3. Exit'));

                    rl.question(chalk.cyan('Choose action (1, 2, 3): '), async (action) => {
                        if (action === '1') {
                            rl.question(chalk.cyan('Enter new role (admin/customer): '), async (newRole) => {
                                try {
                                    await axios.put(`${URL}/${selectedUser._id}`, { role: newRole }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    console.log(chalk.green(`✅ Role updated to '${newRole}'.`));
                                } catch (err) {
                                    console.error(chalk.red('❌ Update failed:'), err.response?.data || err.message);
                                }
                                rl.close();
                            });
                        } else if (action === '2') {
                            rl.question(chalk.yellow('Are you sure you want to delete this user? (yes/no): '), async (confirm) => {
                                if (confirm.toLowerCase() === 'yes') {
                                    try {
                                        await axios.delete(`${URL}/${selectedUser._id}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        console.log(chalk.green('🗑 User deleted.'));
                                    } catch (err) {
                                        console.error(chalk.red('❌ Delete failed:'), err.response?.data || err.message);
                                    }
                                } else {
                                    console.log(chalk.yellow('❌ Deletion cancelled.'));
                                }
                                rl.close();
                            });
                        } else {
                            console.log(chalk.green('👋 Cancelled.'));
                            rl.close();
                        }
                    });
                });
            } catch (err) {
                spinner.fail('Failed to fetch users.');
                console.error(chalk.red('❌ Error:'), err.message);
                rl.close();
            }
        }, 300); // delay to visually show spinner before axios starts
    } catch (err) {
        console.error(chalk.red('\n❌ Error:'), err.message);
        rl.close();
    }
});
