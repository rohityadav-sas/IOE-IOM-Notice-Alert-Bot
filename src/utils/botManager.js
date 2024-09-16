const { compareAndSaveChatIds, sendMessagesToChatIds, removeChatId } = require('./noticeSender');
const { fetchSavedNotices } = require('./noticeManager');
const { log } = require('./logger');

async function botOnStart(bot, chatIdsPath, college, savedNoticesPath) {
    bot.onText('/start', async (msg) => {
        compareAndSaveChatIds(msg.chat.id, chatIdsPath);
        let name = msg.from.first_name;
        if (msg.from.last_name) { name += ` ${msg.from.last_name}`; }
        console.log(`${name} started the ${college} bot`);
        log(`${name} started the ${college} bot. Chat ID: ${msg.chat.id}`);
        try {
            await bot.sendMessage(msg.chat.id, `Welcome to ${college} Notice Alert Bot.`);
            await bot.sendMessage(
                msg.chat.id,
                `📢 <b>Here are some latest Notices:</b>\n\n`,
                { parse_mode: 'HTML' }
            );
            await Promise.all(savedNoticesPath.map(async (path) => {
                const savedNotices = await fetchSavedNotices(path);
                await sendMessagesToChatIds(bot, [msg.chat.id], [savedNotices[0]], chatIdsPath);
            }));
            await bot.sendMessage(
                msg.chat.id,
                `✅ Subscription Confirmed!\n\n` +
                `📢 You will now receive all important notices from <b>${college}</b> as soon as they are published.\n\n` +
                `Stay tuned for the latest updates! 🚀`,
                { parse_mode: 'HTML' }
            );
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

module.exports = { botOnStart };

