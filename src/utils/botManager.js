const { compareAndSaveChatIds, sendMessagesToChatIds, removeChatId } = require('./utils');
const { fetchSavedNotices } = require('./noticeManager');
const { log } = require('./logger');

async function botOnStart(bot, chatIdsPath, college) {
    bot.onText('/start', async (msg) => {
        compareAndSaveChatIds(msg.chat.id, chatIdsPath);
        let name = msg.from.first_name;
        if (msg.from.last_name) { name += ` ${msg.from.last_name}`; }
        console.log(`${name} started the ${college} bot`);
        log(`${name} started the ${college} bot. Chat ID: ${msg.chat.id}`);
        try {
            await bot.sendMessage(msg.chat.id, `Welcome to ${college} Notice Alert Bot.`);
            await bot.sendMessage(msg.chat.id, "Do you want to see some previous notices?", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Yes', callback_data: 'Yes' }, { text: 'No', callback_data: 'No' }]]
                }
            });
        }
        catch (error) {
            if (error.response && error.response.statusCode === 403) {
                console.error(`User with chatId ${msg.chat.id} has blocked the bot. Removing the chatId from the database...`);
                log(`User with chatId ${msg.chat.id} has blocked the bot.`);
                await removeChatId(msg.chat.id, chatIdsPath);
            }
        }
    });
}

async function botCallback(bot, savedNoticesPath) {
    bot.on('callback_query', async (query) => {
        bot.answerCallbackQuery(query.id);
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        const college = query.message.from.first_name.split(' ')[0];
        if (query.data === 'Yes') {
            await Promise.all(savedNoticesPath.map(async (path) => {
                const savedNotices = await fetchSavedNotices(path);
                await sendMessagesToChatIds(bot, [chatId], savedNotices);
            }));
        }
        await bot.sendMessage(
            chatId,
            `✅ You are now all set!\n\n` +
            `📢 You will now receive all important notices from <b>${college}</b> as soon as they are published.\n\n` +
            `Stay tuned for the latest updates! 🚀`,
            { parse_mode: 'HTML' }
        );
        await bot.deleteMessage(chatId, messageId);
    });
}


module.exports = { botOnStart, botCallback };

