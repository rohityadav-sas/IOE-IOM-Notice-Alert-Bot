const TelegramBot = require('node-telegram-bot-api');
const { botOnStart, botOnCallback } = require('./botManager');
const { sendNoticeIOE, sendNoticeIOM } = require('./noticeSender');
const { log } = require('./logger');
const paths = require('./filePaths');

async function handleBot(botToken, chatIdsPath, savedNoticesPath, sendNoticeFn, botName) {
    const bot = new TelegramBot(botToken, { polling: true });
    try {
        await botOnStart(bot, chatIdsPath, botName);
        await botOnCallback(bot, chatIdsPath, botName, savedNoticesPath);
        setInterval(async () => {
            await sendNoticeFn(bot);
        }, 1000);
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
        log(`Error with bot: ${error.message}`);
    }
}

module.exports = { main };
