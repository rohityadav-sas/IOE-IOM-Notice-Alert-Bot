const simpleGit = require('simple-git');
const { formatDate, formatTime } = require('./date&TimeFormatter');
const git = simpleGit();
require('dotenv').config();
const errorAdmin = '7070127929';

async function pushChanges(message, bot) {
    try {
        const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/rohityadav-sas/IOE-IOM-Notice-Alert-Bot.git`;

        const remotes = await git.getRemotes(true);
        const remoteExists = remotes.some(remote => remote.name === 'origin');
        if (remoteExists) {
            await git.remote(['set-url', 'origin', remoteUrl]);
        } else {
            await git.addRemote('origin', remoteUrl);
        }
        await git.checkout('master');
        await git.branch(['--set-upstream-to=origin/master', 'master']);

        const status = await git.status();
        if (status.files.length === 0) {
            await bot.sendMessage(errorAdmin, 'No changes detected. Skipping commit and push.');
            await informNextCommitDate(bot);
            return;
        }
        else {
            const changedFiles = status.files.map(file => `<b>${file.path}</b>`).join('\n');
            await bot.sendMessage(errorAdmin, `Changes detected in:\n\n${changedFiles}.\n\nCommiting and Pushing...`, { parse_mode: 'HTML' });
        }

        await git.add('./*');
        await git.commit(message);
        await git.push('origin', 'master');
        await bot.sendMessage(errorAdmin, 'Changes pushed successfully');

        await informNextCommitDate(bot);
    } catch (err) {
        await bot.sendMessage(errorAdmin, 'Error pushing changes');
        console.error('Error pushing changes:', err);
    }
}

async function informNextCommitDate(bot) {
    const nextCommitDate = new Date(Date.now() + 1000 * 60 * 60 * 6);
    const date = formatDate(nextCommitDate);
    const time = formatTime(nextCommitDate);
    await bot.sendMessage(errorAdmin, `Next commit scheduled for:\n\n<b>${date}</b>\n<b>${time}</b>`, { parse_mode: 'HTML' });
}

module.exports = { pushChanges };
