const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'logs.html'));
});

router.get('/logs-content', (req, res) => {
    const logFilePath = path.join(__dirname, '..', 'utils', 'logs.txt');

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).send('Error reading log file.');
        }
        res.send(data);
    });
});

router.get('/download', (req, res) => {
    const logFilePath = path.join(__dirname, '..', 'utils', 'logs.txt');
    res.download(logFilePath, 'logs.txt', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

module.exports = router;
