const express = require('express');
const fs = require('fs');
const path = require('path');
const logsRouter = express.Router();

const logsFilePath = path.join(__dirname, '..', 'utils', 'logs.txt');

logsRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'logs', 'logs.html'));
});

logsRouter.get('/getlogs', (req, res) => {
    fs.readFile(logsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).send('Error reading log file.');
        }
        res.send(data);
    });
});

logsRouter.get('/download', (req, res) => {
    res.download(logsFilePath, 'logs.txt', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

logsRouter.post('/clear', (req, res) => {
    fs.writeFile(logsFilePath, '', (err) => {
        if (err) {
            console.error('Error clearing logs:', err);
            res.status(500).send('Error clearing logs.');
        } else {
            res.send('Logs cleared.');
        }
    });
});

module.exports = logsRouter;
