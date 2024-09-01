const { compareAndSaveChatIds } = require('./utils');
const { fetchSavedNotices } = require('./noticeManager');

async function botOnStart(bot, chatIdsPath, college) {
    bot.onText('/start', async (msg) => {
        compareAndSaveChatIds(msg.chat.id, chatIdsPath);
        let name = msg.from.first_name;
        if (msg.from.last_name) { name += ` ${msg.from.last_name}`; }
        console.log(`${name} started the ${college} bot`);
        await bot.sendMessage(msg.chat.id, `Welcome to ${college} Notice Alert Bot.`);
        await bot.sendMessage(msg.chat.id, "Do you want to see some previous notices?", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Yes', callback_data: 'Yes' }, { text: 'No', callback_data: 'No' }]]
            }
        });
    });
}

async function botCallback(bot, savedNoticesPath) {
    bot.on('callback_query', async (query) => {
        bot.answerCallbackQuery(query.id);
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        const college = query.message.from.first_name.split(' ')[0];
        if (query.data === 'Yes') {
            let savedNotices = await fetchSavedNotices(savedNoticesPath);
            for (let i = savedNotices.length - 1; i >= 0; i--) {
                const notice = savedNotices[i];
                const date = notice.Date;
                const description = notice.Description;
                const url = notice.Url;
                const message = `ㅤ\n<b>Date: </b><u><b>${date}</b></u>\n\n<b>${description}</b>\n\n<a href="${url}">Read more</a>`;
                await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
            }
        }
        await bot.sendMessage(chatId, `🚀 You will now receive notices from ${college} as soon as they are published. 🚀`,);
        await bot.deleteMessage(chatId, messageId);
    });
}


module.exports = { botOnStart, botCallback };

