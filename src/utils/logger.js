const fs = require('fs');
const path = require('path');
const { pushChanges } = require('./auto-push');
const logFilePath = path.join(__dirname, 'logs.txt');

function getFormattedDate() {
    if (!fs.existsSync(logFilePath)) { fs.writeFileSync(logFilePath, '') }
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(now);
    const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return `[${formattedDate}] [${formattedTime}]`;
}

function log(message) {
    const timestamp = getFormattedDate();
    const logMessage = `${timestamp} - ${message}\n`;
    console.log(logMessage);
    fs.appendFileSync(logFilePath, logMessage);
    pushChanges();
}

module.exports = { log };
