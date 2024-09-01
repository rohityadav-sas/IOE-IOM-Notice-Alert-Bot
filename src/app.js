require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const { botOnStart, botCallback } = require('./utils/botManager');
const { sendNoticeIOE, sendNoticeIOM } = require('./utils/utils');
const chatIdsPathIOE = path.join(__dirname, './ioe/IOEChatIds.json');
const chatIdsPathIOM = path.join(__dirname, './iom/IOMChatIds.json');
const IOMSavedNoticesPath = path.join(__dirname, './iom/IOMSavedNotices.json');
const IOESavedNoticesPath = path.join(__dirname, './ioe/IOESavedNotices.json');

async function handleBot(botToken, chatIdsPath, savedNoticesPath, sendNoticeFn, botName, pollingDuration) {
    const bot = new TelegramBot(botToken, { polling: true });
    try {
        await botOnStart(bot, chatIdsPath, botName);
        await botCallback(bot, savedNoticesPath);
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
    const pollingDuration = 5;
    try {
        await Promise.all([
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOE, chatIdsPathIOE, IOESavedNoticesPath, sendNoticeIOE, 'IOE', pollingDuration),
            handleBot(process.env.TELEGRAM_BOT_TOKEN_IOM, chatIdsPathIOM, IOMSavedNoticesPath, sendNoticeIOM, 'IOM', pollingDuration)
        ]);
    } catch (error) {
        console.error('An error occurred while running the bots:', error);
    }
}

main();
