const fs = require('fs');


async function fetchChatIds(chatIdsPath) {
    const chatIds = fs.readFileSync(chatIdsPath, 'utf8');
    if (!chatIds) {
        return [];
    }
    return JSON.parse(chatIds);
}

module.exports = { fetchChatIds }
