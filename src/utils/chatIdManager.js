const fs = require('fs');
const path = require('path');


async function fetchChatIds(chatIdsPath) {
    try {
        const chatIds = JSON.parse(fs.readFileSync(chatIdsPath, 'utf-8')) || [];
        return chatIds;
    } catch (error) {
        console.error(`Error reading chat IDs from ${chatIdsPath}: ${error.message}`);
        return [];
    }
}

async function extractName({ from }) {
    return [from.first_name, from.last_name].filter(Boolean).join(' ');
}

async function compareAndSaveChatIds(chatID, chatIdsPath) {
    const chatIds = await fetchChatIds(chatIdsPath);
    if (!chatIds.includes(chatID.toString())) {
        chatIds.push(chatID.toString());
        fs.writeFileSync(chatIdsPath, JSON.stringify(chatIds, null, 2));
    }
}

async function removeChatId(chatId, chatIdsPath) {
    try {
        const chatIds = await fetchChatIds(chatIdsPath);
        const updatedChatIds = chatIds.filter(id => id !== chatId);
        fs.writeFileSync(chatIdsPath, JSON.stringify(updatedChatIds, null, 2));
    } catch (error) {
        console.error(`Error removing chatId ${chatId} from ${chatIdsPath}: ${error.message}`);
    }
}

module.exports = { fetchChatIds, extractName, compareAndSaveChatIds, removeChatId };