const ROLE = {
    ADMIN: 'admin',
    USER: 'user'
}

const users = [
    { id: 1, userName: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: ROLE.ADMIN },
    { id: 2, userName: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: ROLE.USER }
];

module.exports = { ROLE, users };