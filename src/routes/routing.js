require('dotenv').config();

const express = require('express');
const router = express.Router();
const userService = require('../service/users');
const jwt = require('jsonwebtoken');
const { ROLE } = require('../model/data');
router.post('/login', async (req, res, next) => {
    try {
        let user = await userService.login(req.body);
        if (user) {
            res.json(user);
        } else {
            res.status(400)
            res.json({ message: 'Username or password is incorrect' });
        }
    } catch (err) {
        console.log(err.message);
    }
})
let verifyToken = (req, res, next) => {
    try {
        let authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken) {
            res.status(401);
            res.json({ message: "Invalid Request" });
        } else {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
                if (error) {
                    let err = new Error("Access Denied");
                    err.status = 403;
                    throw err;
                }
                else {
                    req.user = payload;
                    next();
                }
            })
        }
    } catch (err) {
        err.status ? res.status(err.status) : res.status(500);
        res.json({ message: err.message });
    }
}

/* admins can only fetch all users data */
router.get('/users', verifyToken, async (req, res, next) => {
    console.log("request came here");
    try {
        /* Providing access to to only admin role */
        if (req.user.role === 'admin') {
            let users = await userService.getAllUsers();
            res.json(users);
        } else {
            res.status(403);
            res.json({ message: 'Unauthorized access' });
        }
    } catch (err) {
        res.status(500);
        res.json({ message: err.message });
    }
});
router.get('/user/:id', verifyToken, async (req, res, next) => {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    /* only allow admins to access other user records */
    if (id !== currentUser.sub && currentUser.role !== ROLE.ADMIN) {
        res.status(403);
        res.json({ message: 'Unauthorized access' });
    } else {
        let user = await userService.getUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    }
});
module.exports = router;