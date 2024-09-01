const fs = require('fs');
const path = require('path');
const { fetchSavedNotices, checkForNewNotices, fetchCurrentNoticesIOE, fetchCurrentNoticesIOM } = require('./noticeManager');
const IOMSavedNoticesPath = path.join(__dirname, '../iom/IOMSavedNotices.json');
const IOESavedNoticesPath = path.join(__dirname, '../ioe/IOESavedNotices.json');
const IOMChatIdsPath = path.join(__dirname, '../iom/IOMChatIds.json');
const IOEChatIdsPath = path.join(__dirname, '../ioe/IOEChatIds.json');


async function fetchChatIds(chatIdsPath) {
    const chatIds = fs.readFileSync(chatIdsPath, 'utf-8');
    if (!chatIds) { return [] }
    return JSON.parse(chatIds);
}

async function compareAndSaveChatIds(chatID, chatIdsPath) {
    const chatIds = await fetchChatIds(chatIdsPath);
    if (!chatIds.includes(chatID)) {
        chatIds.push(chatID);
        fs.writeFileSync(chatIdsPath, JSON.stringify(chatIds, null, 2));
    }
}

async function sendNotices(bot, fetchCurrentNotices, savedNoticesPath, chatIdsPath) {
    const currentNotices = await fetchCurrentNotices();
    const savedNotices = await fetchSavedNotices(savedNoticesPath);
    const newNotices = await checkForNewNotices(currentNotices, savedNotices, savedNoticesPath);
    if (newNotices.length > 0) {
        const chatIds = await fetchChatIds(chatIdsPath);
        await sendMessagesToChatIds(bot, chatIds, newNotices);
    }
}

async function sendMessagesToChatIds(bot, chatIds, notices) {
    for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        for (let j = notices.length - 1; j >= 0; j--) {
            const notice = notices[j];
            const message = formatMessage(notice);
            await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        }
    }
}

function formatMessage(notice) {
    const { Date: date, Description: description, Url: url } = notice;
    return `ㅤ\n<b>Date: </b><u><b>${date}</b></u>\n\n<b>${description}</b>\n\n<a href="${url}">Read more</a>`;
}

async function sendNoticeIOE(bot) {
    await sendNotices(bot, fetchCurrentNoticesIOE, IOESavedNoticesPath, IOEChatIdsPath);
}

async function sendNoticeIOM(bot) {
    await sendNotices(bot, fetchCurrentNoticesIOM, IOMSavedNoticesPath, IOMChatIdsPath);
}



module.exports = { compareAndSaveChatIds, sendNoticeIOE, sendNoticeIOM };
