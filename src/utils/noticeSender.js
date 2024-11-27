const { fetchCurrentNoticesIOE } = require('../ioe/IOEUtils');
const { fetchCurrentNoticesIOM } = require('../iom/IOMUtils');
const { handleNotices } = require('./noticeManager');
const { fetchChatIds, removeChatId } = require('./chatIdManager');
const { log } = require('./logger');
const paths = require('./filePaths');

async function processNotices(
	bot,
	fetchCurrentNotices,
	savedNoticesPath,
	chatIdsPath
) {
	try {
		const newNotices = await handleNotices(
			fetchCurrentNotices,
			savedNoticesPath
		);
		await sendNotices(bot, newNotices, chatIdsPath);
	} catch (error) {
		console.error(`Error processing notices: ${error.message}`);
	}
}

async function sendNotices(bot, newNotices, chatIdsPath) {
	try {
		if (newNotices.length > 0) {
			const chatIds = await fetchChatIds(chatIdsPath);
			await sendMessagesToChatIds(bot, chatIds, newNotices, chatIdsPath);
			let logMessage = '';
			newNotices.forEach((notice) => {
				logMessage += `New notice received: ${notice.Description}`;
			});
			await log(logMessage);
		}
	} catch (error) {
		console.error(`Error sending notices: ${error.message}`);
	}
}

async function sendMessagesToChatIds(bot, chatIds, notices, chatIdsPath) {
	for (const chatId of chatIds) {
		for (let j = notices.length - 1; j >= 0; j--) {
			const notice = notices[j];
			const message = formatMessage(notice);
			try {
				await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
			} catch (error) {
				if (error.response && error.response.statusCode === 403) {
					await removeChatId(chatId, chatIdsPath);
					await log(`User with chatId ${chatId} has blocked the bot.`, 'red');
				} else {
					await log(
						`Error sending message to ${chatId}: ${error.message}`,
						'red'
					);
				}
			}
		}
	}
}

function formatMessage(notice) {
	const { Date: date, Description: description, Url: url } = notice;
	return `<b>📅  Date: </b><u><b>${date}</b></u>\n\n<b>📝  Notice:</b>\n<b><i>${description}</i></b>\n\n<a href="${url}">🔗 Read more</a>\n\n<i>Stay updated for more important news!</i> 💡`;
}

async function sendNoticeIOE(bot) {
	let noticePaths = {
		exam: paths.IOEExamNoticesPath,
		entrance: paths.IOEEntranceNoticesPath,
		official: paths.IOEOfficialPageNoticesPath,
		admission: paths.IOEAdmissionNoticesPath
	};
	await Promise.all(
		Object.keys(noticePaths).map(async (key) => {
			await processNotices(
				bot,
				fetchCurrentNoticesIOE(key),
				noticePaths[key],
				paths.chatIdsPathIOE
			);
		})
	);
}

async function sendNoticeIOM(bot) {
	await processNotices(
		bot,
		fetchCurrentNoticesIOM(),
		paths.IOMExamNoticesPath,
		paths.chatIdsPathIOM
	);
}

module.exports = { sendNoticeIOE, sendNoticeIOM, sendMessagesToChatIds };
