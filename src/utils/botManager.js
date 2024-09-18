const { sendMessagesToChatIds } = require('./noticeSender');
const { fetchSavedNotices } = require('./noticeManager');
const { log } = require('./logger');
const { extractName, compareAndSaveChatIds, removeChatId } = require('./chatIdManager');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function botOnStart(bot, chatIdsPath, college) {
    bot.onText('/start', async (msg) => {
        await handleNewUser(bot, msg, chatIdsPath, college);
    });
    bot.onText(/logs/i, async (msg) => {
        if (msg.chat.id.toString() === '7070127929') {
            const token = jwt.sign({ user: 'simple' }, process.env.JWT_SECRET, {
                expiresIn: '5m'
            })
            setTimeout(() => {
                bot.sendMessage(msg.chat.id, 'Token expired');
            }, 5 * 60 * 1000);
            await bot.sendMessage(msg.chat.id, 'View logs:', {
                reply_markup: {
                    inline_keyboard: [[
                        { text: 'Logs', web_app: { url: `https://ioe-iom-notice-alert-bot-bkvn.onrender.com/logs/?token=${token}`, hide_url: true } }
                    ]]
                }
            })
        }
        else {
            await bot.sendMessage(msg.chat.id, 'You are not authorized to view the logs.');
        }
    });
}


async function botOnCallback(bot, chatIdsPath, college, savedNoticesPath) {
    bot.on('callback_query', async (query) => {
        const { chat, message_id } = query.message;
        const chatId = chat.id;
        await bot.deleteMessage(chatId, message_id);

        const name = await extractName(query);
        const queryData = query.data;
        if (queryData === 'latest') {
            await handleLatestNotices(bot, chatId, college, savedNoticesPath, chatIdsPath, name);
        } else if (queryData === 'no') {
            await sendSubscriptionMessage(bot, chatId, college, chatIdsPath, name);
        }
        await log(`${name} selected: ${queryData === 'latest' ? 'Latest Notices' : 'No'}`);
    });
}

async function handleNewUser(bot, msg, chatIdsPath, college) {
    const chatId = msg.chat.id;
    await compareAndSaveChatIds(chatId, chatIdsPath);
    const name = await extractName(msg);
    try {
        await bot.sendMessage(chatId, `Welcome to ${college} Notice Alert Bot.`);
        await bot.sendMessage(chatId, 'Do you want to see some latest notices?', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Yes', callback_data: 'latest' }, { text: '❌ No', callback_data: 'no' }]
                ]
            }
        });
        await log(`${name} started the ${college} bot. Chat ID: ${chatId}`);
    } catch (error) {
        await handleBotError(chatId, error, chatIdsPath);
    }
}

async function handleLatestNotices(bot, chatId, college, savedNoticesPath, chatIdsPath, name) {
    try {
        await bot.sendMessage(chatId, `📢 <b>Here are some latest Notices:</b>\n\n`, { parse_mode: 'HTML' });

        for (const path of savedNoticesPath) {
            const savedNotices = await fetchSavedNotices(path);
            if (savedNotices.length > 0) {
                await sendMessagesToChatIds(bot, [chatId], [savedNotices[0]], chatIdsPath);
            }
        }
        await sendSubscriptionMessage(bot, chatId, college, chatIdsPath, name);
    } catch (error) {
        await handleBotError(chatId, error, chatIdsPath, name);
    }
}

async function sendSubscriptionMessage(bot, chatId, college, chatIdsPath, name) {
    try {
        await bot.sendMessage(
            chatId,
            `✅ You are all set!\n\n` +
            `📢 You will now receive all important notices from <b>${college}</b> as soon as they are published.\n\n` +
            `<i>Stay tuned for the latest updates! 🚀</i>`,
            { parse_mode: 'HTML' }
        );
    } catch (error) {
        await handleBotError(chatId, error, chatIdsPath, name);
    }
}

async function handleBotError(chatId, error, chatIdsPath, name) {
    if (error.response?.statusCode === 403) {
        await removeChatId(chatId, chatIdsPath);
        await log(`User ${name} with chatId ${chatId} has blocked the bot.`, 'red');
    } else {
        console.error(`Error: ${error.message}`);
    }
}

module.exports = { botOnStart, botOnCallback };
