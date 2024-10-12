const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN_IOE, { polling: true });

const getChatDetails = async (chatId) => {
    try {
        const chat = await bot.getChat(chatId);
        console.log(chat);
    } catch (error) {
        console.error('Error getting chat details:', error);
    }
};

getChatDetails('1012711232');