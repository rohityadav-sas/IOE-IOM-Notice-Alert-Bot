const fs = require('fs');
const path = require('path');
const { fetchCurrentNoticesIOE } = require('../ioe/IOEUtils');
const { fetchCurrentNoticesIOM } = require('../iom/IOMUtils');
const { fetchSavedNotices, checkForNewNotices } = require('./noticeManager');
const { log } = require('./logger');
const { pushChanges } = require('./auto-push');
const IOMExamNoticesPath = path.join(__dirname, '../iom/IOM_Exam_Notices.json');
const IOEExamNoticesPath = path.join(__dirname, '../ioe/IOE_Exam_Notices.json');
const IOEEntranceNoticesPath = path.join(__dirname, '../ioe/IOE_Entrance_Notices.json');
const IOEOfficialPageNoticesPath = path.join(__dirname, '../ioe/IOE_Official_Page_Notices.json');
const IOMChatIdsPath = path.join(__dirname, '../iom/IOMChatIds.json');
const IOEChatIdsPath = path.join(__dirname, '../ioe/IOEChatIds.json');


let cachedChatIds = {};

async function fetchChatIds(chatIdsPath) {
    if (cachedChatIds[chatIdsPath]) {
        return cachedChatIds[chatIdsPath];
    }

    try {
        const chatIds = JSON.parse(fs.readFileSync(chatIdsPath, 'utf-8')) || [];
        cachedChatIds[chatIdsPath] = chatIds;
        return chatIds;
    } catch (error) {
        console.error(`Error reading chat IDs from ${chatIdsPath}: ${error.message}`);
        return [];
    }
}

async function compareAndSaveChatIds(chatID, chatIdsPath) {
    const chatIds = await fetchChatIds(chatIdsPath);
    if (!chatIds.includes(chatID)) {
        chatIds.push(chatID);
        fs.writeFileSync(chatIdsPath, JSON.stringify(chatIds, null, 2));
        cachedChatIds[chatIdsPath] = chatIds
    }
}


async function sendNotices(bot, fetchCurrentNotices, savedNoticesPath, chatIdsPath) {
    try {
        const savedNotices = await fetchSavedNotices(savedNoticesPath);
        const currentNotices = await fetchCurrentNotices;
        const newNotices = await checkForNewNotices(currentNotices, savedNotices, savedNoticesPath);
        if (newNotices.length > 0) {
            const chatIds = await fetchChatIds(chatIdsPath);
            newNotices.forEach(notice => {
                log(`New notice received: ${notice.Description} (Published on: ${notice.Date})`);
            });
            await sendMessagesToChatIds(bot, chatIds, newNotices, chatIdsPath);
            pushChanges();
        }
    }
    catch (error) {
        console.error(`Error sending notices: ${error.message}`);
    }
}

async function sendMessagesToChatIds(bot, chatIds, notices, chatIdsPath) {
    for (const chatId of chatIds) {
        for (let j = notices.length - 1; j >= 0; j--) {
            const notice = notices[j];
            const message = formatMessage(notice);
            try { await bot.sendMessage(chatId, message, { parse_mode: 'HTML' }); }
            catch (error) {
                if (error.response && error.response.statusCode === 403) {
                    console.error(`User with chatId ${chatId} has blocked the bot. Removing the chatId from the database...`);
                    log(`User with chatId ${chatId} has blocked the bot.`);
                    await removeChatId(chatId, chatIdsPath);
                    pushChanges();

                }
                else {
                    console.error(`Error sending message to ${chatId}: ${error.message}`);
                    log(`Error sending message to ${chatId}: ${error.message}`);
                    pushChanges();
                }
            }
        }
    }
}

async function removeChatId(chatId, chatIdsPath) {
    try {
        const chatIds = await fetchChatIds(chatIdsPath);
        const updatedChatIds = chatIds.filter(id => id !== chatId);
        fs.writeFileSync(chatIdsPath, JSON.stringify(updatedChatIds, null, 2));
        cachedChatIds[chatIdsPath] = updatedChatIds;
    }
    catch (error) {
        console.error(`Error removing chatId ${chatId} from ${chatIdsPath}: ${error.message}`);
    }
}

function formatMessage(notice) {
    const { Date: date, Description: description, Url: url } = notice;
    return `<b>📅  Date: </b><u><b>${date}</b></u>\n\n<b>📝  Notice:</b>\n<b><i>${description}</i></b>\n\n<a href="${url}">🔗 Read more</a>\n\n<i>Stay updated for more important news!</i> 💡`;
}

async function sendNoticeIOE(bot) {
    await sendNotices(bot, fetchCurrentNoticesIOE('exam'), IOEExamNoticesPath, IOEChatIdsPath);
    await sendNotices(bot, fetchCurrentNoticesIOE('entrance'), IOEEntranceNoticesPath, IOEChatIdsPath);
    await sendNotices(bot, fetchCurrentNoticesIOE('official'), IOEOfficialPageNoticesPath, IOEChatIdsPath);
}

async function sendNoticeIOM(bot) {
    await sendNotices(bot, fetchCurrentNoticesIOM(), IOMExamNoticesPath, IOMChatIdsPath);
}



module.exports = { compareAndSaveChatIds, sendNoticeIOE, sendNoticeIOM, sendMessagesToChatIds, removeChatId };
