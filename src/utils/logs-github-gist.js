const axios = require('axios');
const fs = require('fs');
require('dotenv').config();


const gistUrl = `https://api.github.com/gists/${process.env.GIST_ID}`;

const headers = {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
};

function updateToGist(logFilePath) {
    const fileContent = fs.readFileSync(logFilePath, 'utf-8');
    axios.patch(gistUrl, {
        files: {
            'logs.txt': {
                content: fileContent
            }
        }
    }, { headers }).then(() => {
        console.log('Gist updated successfully');
    }).catch(error => {
        console.error('Error updating gist:', error);
    });
}


function updateFromGist(logFilePath) {
    axios.get(gistUrl, headers).then(response => {
        const logs = response.data.files['logs.txt'].content;
        fs.writeFileSync(logFilePath, logs);
        console.log('Logs updated successfully');
    }).catch(error => {
        console.error('Error updating logs:', error);
    });
}


module.exports = { updateToGist, updateFromGist };
