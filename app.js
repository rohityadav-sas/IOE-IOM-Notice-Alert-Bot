require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const chatIdsPath = path.join(__dirname, '/assets/chatIds.json');
const { fetchChatIds } = require('./chatIdsManager');
const { fetchCurrentNotices, fetchSavedNotices, checkForNewNotices } = require('./noticeManager');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const exitAfterTimeout = () => {
    setTimeout(() => {
        process.exit(0);
    }, 20000);
};

exitAfterTimeout();

bot.onText('/start', async (msg) => {
    const chatIds = await fetchChatIds(chatIdsPath);
    if (!chatIds.includes(msg.chat.id)) {
        chatIds.push(msg.chat.id);
        fs.writeFileSync(chatIdsPath, JSON.stringify(chatIds, null, 2));
    }
    const name = msg.from.first_name + " " + msg.from.last_name;
    console.log(`${name} started the bot.`);
    if (name === "Saberika Shrestha") {
        bot.sendMessage(msg.chat.id, "I love you babey");
    }
    await bot.sendMessage(msg.chat.id, "Welcome to IOM Notice Bot.");
    await bot.sendMessage(msg.chat.id, "Do you want to see some previous notices now?", {
        "reply_markup": {
            "keyboard": [["Yes", "No"]],
            "resize_keyboard": true,
            "one_time_keyboard": true
        }
    });
});

bot.onText('Yes', async (msg) => {
    let savedNotices = await fetchSavedNotices();
    for (let i = savedNotices.length - 1; i >= 0; i--) {
        const notice = savedNotices[i];
        const date = notice.Date;
        const title = notice.Title;
        const url = notice.Url;
        const message = `ㅤ\n<b>Date: </b><u><b>${date}</b></u>\n\n<b>${title}</b>\n\n<a href="${url}">Read more</a>`;
        await bot.sendMessage(msg.chat.id, message, { parse_mode: 'HTML' });
    }
    await removeKeyboard(msg.chat.id);
});

bot.onText('No', async (msg) => {
    await removeKeyboard(msg.chat.id);
});

async function removeKeyboard(chatId) {
    await bot.sendMessage(chatId, "🚀 You will now receive notices from IOM as soon as they are published. 🚀", {
        "reply_markup": {
            "remove_keyboard": true
        }
    });
}

async function sendNotice() {
    const currentNotices = await fetchCurrentNotices();
    const savedNotices = await fetchSavedNotices();
    const newNotices = await checkForNewNotices(currentNotices, savedNotices);
    if (newNotices.length > 0) {
        const chatIds = await fetchChatIds(chatIdsPath);
        for (let i = 0; i < chatIds.length; i++) {
            const chatId = chatIds[i];
            for (let j = newNotices.length - 1; j >= 0; j--) {
                const notice = newNotices[j];
                const date = notice.Date;
                const title = notice.Title;
                const url = notice.Url;
                const message = `ㅤ\n<b>Date: </b><u><b>${date}</b></u>\n\n<b>${title}</b>\n\n<a href="${url}">Read more</a>`;
                await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
            }
        }
    }
}

sendNotice();
