const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs.txt');
const { formatDate, formatTime } = require('./date&TimeFormatter');

const colorCodes = {
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

function getFormattedDate() {
    if (!fs.existsSync(logFilePath)) { fs.writeFileSync(logFilePath, '') }
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);
    return `[${formattedDate}] [${formattedTime}]`;
}

function log(message, color = 'yellow') {
    const timestamp = getFormattedDate();
    const logMessage = `${timestamp} - ${message}\n`;
    const colorCode = colorCodes[color];
    console.log(`${colorCode}%s${colorCodes.reset}`, logMessage);
    fs.appendFileSync(logFilePath, logMessage);
}

module.exports = { log };
