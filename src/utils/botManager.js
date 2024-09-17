const fs = require('fs');
const { sendMessagesToChatIds } = require('./noticeSender');
const { fetchSavedNotices } = require('./noticeManager');
const { log } = require('./logger');
const { extractName, compareAndSaveChatIds, removeChatId } = require('./chatIdManager');


async function botOnStart(bot, chatIdsPath, college) {
    bot.onText('/start', async (msg) => {
        await compareAndSaveChatIds(msg.chat.id, chatIdsPath);
        const name = await extractName(msg);
        log(`${name} started the ${college} bot. Chat ID: ${msg.chat.id}`);

        try {
            await bot.sendMessage(msg.chat.id, `Welcome to ${college} Notice Alert Bot.`);
            await bot.sendMessage(msg.chat.id, 'Do you want to see some latest notices?', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '✅ Yes', callback_data: 'latest' }, { text: '❌ No', callback_data: 'no' }]
                    ]
                }
            });
        } catch (error) {
            if (error.response?.statusCode === 403) {
                log(`User with chatId ${msg.chat.id} has blocked the bot.`, 'red');
                await removeChatId(msg.chat.id, chatIdsPath);
            }
        }
    });
}

async function botOnCallback(bot, chatIdsPath, college, savedNoticesPath) {
    bot.on('callback_query', async (query) => {
        const { chat, message_id } = query.message;
        const chatId = chat.id;
        await bot.deleteMessage(chatId, message_id);
        const name = await extractName(query);
        try {
            if (query.data === 'latest') {
                log(`${name} requested for latest notices`);
                await handleLatestNotices(bot, chatId, college, savedNoticesPath, chatIdsPath);
            } else if (query.data === 'no') {
                log(`${name} declined to see the latest notices`);
                await bot.sendMessage(chatId, createSubscriptionMessage(college), {
                    parse_mode: 'HTML'
                });
            }
        } catch (error) {
            if (error.response?.statusCode === 403) {
                log(`User with chatId ${chatId} has blocked the bot.`, 'red');
                await removeChatId(chatId, chatIdsPath);
            }
            else {
                console.error(`Error handling callback query: ${error.message}`);
            }
        }
    });
}

async function handleLatestNotices(bot, chatId, college, savedNoticesPath, chatIdsPath) {
    try {
        await bot.sendMessage(chatId, `📢 <b>Here are some latest Notices:</b>\n\n`, { parse_mode: 'HTML' });
        for (const path of savedNoticesPath) {
            const savedNotices = await fetchSavedNotices(path);
            if (savedNotices.length > 0) {
                await sendMessagesToChatIds(bot, [chatId], [savedNotices[0]], chatIdsPath);
            }
        }

        await bot.sendMessage(
            chatId,
            `✅ Subscription Confirmed!\n\n` +
            `📢 You will now receive all important notices from <b>${college}</b> as soon as they are published.\n\n` +
            `Stay tuned for the latest updates! 🚀`,
            { parse_mode: 'HTML' }
        );
    } catch (error) {
        if (error.response?.statusCode === 403) {
            log(`User with chatId ${chatId} has blocked the bot.`, 'red');
            await removeChatId(chatId, chatIdsPath);
        }
    }
}

function createSubscriptionMessage(college) {
    return `✅ You are all set!\n\n` +
        `📢 You will receive all important notices from <b>${college}</b> as soon as they are published.\n\n` +
        `Stay tuned for the latest updates! 🚀`;
}

module.exports = { botOnStart, botOnCallback };
