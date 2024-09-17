const { fetchCurrentNoticesIOE } = require('../ioe/IOEUtils');
const { fetchCurrentNoticesIOM } = require('../iom/IOMUtils');
const { fetchSavedNotices, checkForNewNotices } = require('./noticeManager');
const { fetchChatIds, removeChatId } = require('./chatIdManager');
const { log } = require('./logger');
const paths = require('./filePaths');

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
                    log(`User with chatId ${chatId} has blocked the bot.`, 'red');
                    await removeChatId(chatId, chatIdsPath);

                }
                else {
                    log(`Error sending message to ${chatId}: ${error.message}`, 'red');
                }
            }
        }
    }
}

function formatMessage(notice) {
    const { Date: date, Description: description, Url: url } = notice;
    return `<b>📅  Date: </b><u><b>${date}</b></u>\n\n<b>📝  Notice:</b>\n<b><i>${description}</i></b>\n\n<a href="${url}">🔗 Read more</a>\n\n<i>Stay updated for more important news!</i> 💡`;
}

async function sendNoticeIOE(bot) {
    await sendNotices(bot, fetchCurrentNoticesIOE('exam'), paths.IOEExamNoticesPath, paths.chatIdsPathIOE);
    await sendNotices(bot, fetchCurrentNoticesIOE('entrance'), paths.IOEEntranceNoticesPath, paths.chatIdsPathIOE);
    await sendNotices(bot, fetchCurrentNoticesIOE('official'), paths.IOEOfficialPageNoticesPath, paths.chatIdsPathIOE);
    await sendNotices(bot, fetchCurrentNoticesIOE('admission'), paths.IOEAdmissionNoticesPath, paths.chatIdsPathIOE);
}

async function sendNoticeIOM(bot) {
    await sendNotices(bot, fetchCurrentNoticesIOM(), paths.IOMExamNoticesPath, paths.chatIdsPathIOM);
}

module.exports = { sendNoticeIOE, sendNoticeIOM, sendMessagesToChatIds };
