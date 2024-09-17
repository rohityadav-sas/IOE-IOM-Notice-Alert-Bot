const express = require('express');
const loginRouter = express.Router();
const fs = require('fs');
const path = require('path');
const loginFile = path.join(__dirname, '..', 'public', 'login.html');

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
        res.cookie('auth', 'authenticated', { httpOnly: true });
        return res.status(200).send('Authenticated');
    } else {
        return res.status(401).send('Invalid credentials');
    }
});

module.exports = loginRouter;