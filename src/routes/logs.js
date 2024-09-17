const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const logsFilePath = path.join(__dirname, '..', 'utils', 'logs.txt');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'logs.html'));
});

router.get('/logs-content', (req, res) => {
    fs.readFile(logsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).send('Error reading log file.');
        }
        res.send(data);
    });
});

router.get('/download', (req, res) => {
    res.download(logsFilePath, 'logs.txt', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

router.post('/clear', (req, res) => {
    fs.writeFile(logsFilePath, '', (err) => {
        if (err) {
            console.error('Error clearing logs:', err);
            res.status(500).send('Error clearing logs.');
        } else {
            res.send('Logs cleared.');
        }
    });
});

module.exports = router;
