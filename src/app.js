require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const { botOnStart } = require('./utils/botManager');
const { sendNoticeIOE, sendNoticeIOM } = require('./utils/noticeSender');
const { log } = require('./utils/logger');
const chatIdsPathIOE = path.join(__dirname, './ioe/IOEChatIds.json');
const chatIdsPathIOM = path.join(__dirname, './iom/IOMChatIds.json');
const IOMExamNoticesPath = path.join(__dirname, './iom/IOM_Exam_Notices.json');
const IOEExamNoticesPath = path.join(__dirname, './ioe/IOE_Exam_Notices.json');
const IOEEntranceNoticesPath = path.join(__dirname, './ioe/IOE_Entrance_Notices.json');
const IOEOfficialPageNoticesPath = path.join(__dirname, './ioe/IOE_Official_Page_Notices.json');
const IOEAdmissionNoticesPath = path.join(__dirname, './ioe/IOE_Admission_Notices.json');

async function handleBot(botToken, chatIdsPath, savedNoticesPath, sendNoticeFn, botName, pollingDuration) {
    const bot = new TelegramBot(botToken, { polling: true });
    try {
        await botOnStart(bot, chatIdsPath, botName, savedNoticesPath);
        await sendNoticeFn(bot);
        setTimeout(() => {
            // bot.stopPolling();
            console.log(`Bot stopped polling after ${pollingDuration} seconds.`);
            process.exit(0);
        }, pollingDuration * 1000);
    } catch (error) {
        console.error(`Error with ${botName}:`, error);
        // bot.stopPolling();
        process.exit(1);
    }
}

async function main() {
    const pollingDuration = 7;
    try {
        const IOENoticesPath = [IOEExamNoticesPath, IOEEntranceNoticesPath, IOEOfficialPageNoticesPath, IOEAdmissionNoticesPath];
        const IOMNoticesPath = [IOMExamNoticesPath];
        await Promise.all([
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOE, chatIdsPathIOE, IOENoticesPath, sendNoticeIOE, 'IOE', pollingDuration),
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOM, chatIdsPathIOM, IOMNoticesPath, sendNoticeIOM, 'IOM', pollingDuration)
        ]);
    } catch (error) {
        console.error('An error occurred while running the bots:', error);
        log(`Error with ${botName}: ${error.message}`);
        process.exit(1);
    }
}

main();
