const express = require('express');
const loginRouter = express.Router();
const fs = require('fs');
const path = require('path');
const loginFile = path.join(__dirname, '..', 'public', 'login', 'login.html');
const jwt = require('jsonwebtoken');

loginRouter.get('/login', (req, res) => {
    fs.readFile(loginFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading login file:', err);
            return res.status(500).send('Error reading login file.');
        }
        res.send(data);
    });
})

loginRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.USER && password === process.env.PASSWORD) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET);
        res.cookie('auth', token);
        return res.status(200).send();
    } else {
        return res.status(401).send();
    }
});

module.exports = loginRouter;