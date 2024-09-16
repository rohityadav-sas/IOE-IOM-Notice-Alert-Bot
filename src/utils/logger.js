const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs.txt');
const { formatDate, formatTime } = require('./date&TimeFormatter');

function getFormattedDate() {
    if (!fs.existsSync(logFilePath)) { fs.writeFileSync(logFilePath, '') }
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);
    return `[${formattedDate}] [${formattedTime}]`;
}

function log(message) {
    const timestamp = getFormattedDate();
    const logMessage = `${timestamp} - ${message}\n`;
    console.log(logMessage);
    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = { log };
