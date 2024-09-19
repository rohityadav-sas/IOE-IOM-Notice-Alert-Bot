const simpleGit = require('simple-git');
const { formatDate, formatTime } = require('./date&TimeFormatter');
const git = simpleGit();
require('dotenv').config();

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
            await bot.sendMessage('6950481849', 'No changes detected. Skipping commit and push.');
            return;
        }
        else {
            const changedFiles = status.files.map(file => `<b>${file.path}</b>`).join('\n');
            await bot.sendMessage('6950481849', `Changes detected in:\n\n${changedFiles}.\n\nCommiting and Pushing...`, { parse_mode: 'HTML' });
        }

        await git.add('./*');
        await git.commit(message);
        await git.push('origin', 'master');
        await bot.sendMessage('6950481849', 'Changes pushed successfully');

        const nextCommitDate = new Date(Date.now() + 1000 * 60 * 60 * 6);
        const date = formatDate(nextCommitDate);
        const time = formatTime(nextCommitDate);
        await bot.sendMessage('6950481849', `Next commit scheduled for ${date} at ${time}`);
    } catch (err) {
        await bot.sendMessage('6950481849', 'Error pushing changes');
        console.error('Error pushing changes:', err);
    }
}

module.exports = { pushChanges };
