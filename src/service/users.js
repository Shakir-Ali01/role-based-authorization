require('dotenv').config();

const jwt = require('jsonwebtoken');
const { users } = require('../model/data');

let userService = {}

userService.login = async ({ userName, password }) => {
    const user = users.find(user => user.userName === userName && user.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET);
        const { password, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, token };
    }
}

userService.getAllUsers = async () => {
    return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
}

userService.getUserById = async (id) => {
    const user = users.find(user => user.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

module.exports = userService;
