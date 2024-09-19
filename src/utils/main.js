const TelegramBot = require('node-telegram-bot-api');
const { botOnStart, botOnCallback } = require('./botManager');
const { sendNoticeIOE, sendNoticeIOM } = require('./noticeSender');
const { log } = require('./logger');
const paths = require('./filePaths');
const { pushChanges } = require('./gitHelper');

async function handleBot(botToken, chatIdsPath, savedNoticesPath, sendNoticeFn, botName) {
    const bot = new TelegramBot(botToken, { polling: true });
    try {
        await botOnStart(bot, chatIdsPath, botName);
        await botOnCallback(bot, chatIdsPath, botName, savedNoticesPath);
        sendNoticeFn(bot);
        setInterval(async () => {
            await sendNoticeFn(bot);
        }, 5 * 60 * 1000);
        if (botName === 'IOE') {
            setInterval(async () => {
                await pushChanges('Scheduled commit', bot);
            }, 1000 * 60 * 60 * 6);
        }
    } catch (error) {
        console.error(`Error with ${botName}:`, error);
    }
}

async function main() {
    try {
        const IOENoticesPath = [paths.IOEExamNoticesPath, paths.IOEEntranceNoticesPath, paths.IOEOfficialPageNoticesPath, paths.IOEAdmissionNoticesPath];
        const IOMNoticesPath = [paths.IOMExamNoticesPath];
        await Promise.all([
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOE, paths.chatIdsPathIOE, IOENoticesPath, sendNoticeIOE, 'IOE'),
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOM, paths.chatIdsPathIOM, IOMNoticesPath, sendNoticeIOM, 'IOM')
        ]);

    } catch (error) {
        console.error('An error occurred while running the bots:', error);
        await log(`Error with bot: ${error.message}`);
    }
}

module.exports = { main };
