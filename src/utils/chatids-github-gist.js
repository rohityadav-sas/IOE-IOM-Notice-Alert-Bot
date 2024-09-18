const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const printYellow = (text) => {
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';
    console.log(`${yellow}${text}${reset}`);
};

const gistUrls = {
    IOE: `https://api.github.com/gists/${process.env.GIST_ID_IOE}`,
    IOM: `https://api.github.com/gists/${process.env.GIST_ID_IOM}`
};

const headers = {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
};

const updateChatIdsToGist = (type, chatIdsPath) => {
    const ids = JSON.parse(fs.readFileSync(chatIdsPath, 'utf-8')).join('\n');
    axios.patch(gistUrls[type], {
        files: {
            [`${type}ChatIds.txt`]: { content: ids }
        }
    }, { headers })
        .then(() => printYellow(`Chat Ids ${type} updated to Gist successfully\n`))
        .catch(error => console.error('Error updating gist:', error));
};

const updateChatIdsFromGist = (type, logFilePath) => {
    axios.get(gistUrls[type], { headers })
        .then(response => {
            const ids = response.data.files[`${type}ChatIds.txt`].content.split('\n');
            fs.writeFileSync(logFilePath, JSON.stringify(ids, null, 2));
            printYellow(`Chat Ids ${type} updated from Gist successfully\n`);
        })
        .catch(error => console.error('Error updating logs:', error));
};

updateChatIdsFromGist('IOE', path.join(__dirname, '..', 'ioe', 'IOEChatIds.json'));
updateChatIdsFromGist('IOM', path.join(__dirname, '..', 'iom', 'IOMChatIds.json'));

module.exports = {
    updateChatIdsToGist: (type, chatIdsPath) => updateChatIdsToGist(type, chatIdsPath),
    updateChatIdsFromGist
};
