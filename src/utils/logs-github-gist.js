const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const printYellow = (text) => {
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';
    console.log(`${yellow}${text}${reset}`);
};

const gistUrl = `https://api.github.com/gists/${process.env.GIST_ID_LOGS}`;
const headers = {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
};

const updateLogsToGist = (logFilePath) => {
    const fileContent = fs.readFileSync(logFilePath, 'utf-8');
    axios.patch(gistUrl, {
        files: { 'logs.txt': { content: fileContent } }
    }, { headers })
        .then(() => printYellow('Logs updated to Gist successfully\n'))
        .catch(error => console.error('Error updating gist:', error));
};

const updateLogsFromGist = (logFilePath) => {
    axios.get(gistUrl, { headers })
        .then(response => {
            fs.writeFileSync(logFilePath, response.data.files['logs.txt'].content);
            printYellow('Logs updated from Gist successfully\n');
        })
        .catch(error => console.error('Error updating logs:', error));
};

updateLogsFromGist(path.join(__dirname, 'logs.txt'));

module.exports = { updateLogsToGist, updateLogsFromGist };
