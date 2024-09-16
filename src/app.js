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
            bot.stopPolling();
            console.log(`${botName} bot stopped polling after ${pollingDuration} seconds.`);
        }, pollingDuration * 1000);
    } catch (error) {
        console.error(`Error with ${botName}:`, error);
        bot.stopPolling();
    }
}

async function main() {
    const pollingDuration = 1000;
    try {
        await Promise.all([
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOE, chatIdsPathIOE, [IOEExamNoticesPath, IOEEntranceNoticesPath, IOEOfficialPageNoticesPath, IOEAdmissionNoticesPath], sendNoticeIOE, 'IOE', pollingDuration),
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOM, chatIdsPathIOM, [IOMExamNoticesPath], sendNoticeIOM, 'IOM', pollingDuration)
        ]);
    } catch (error) {
        console.error('An error occurred while running the bots:', error);
        log(`Error with ${botName}: ${error.message}`);
    }
}

main();
