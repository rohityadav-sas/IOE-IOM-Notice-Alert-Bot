const simpleGit = require('simple-git');
const git = simpleGit();
require('dotenv').config();

async function pushChanges(message) {
    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const remoteUrl = `https://${GITHUB_TOKEN}@github.com/rohityadav-sas/IOE-IOM-Notice-Alert-Bot.git`;

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
            console.log('No changes detected. Skipping commit and push.');
            return;
        }

        await git.add('./*');
        await git.commit(message);
        await git.push('origin', 'master');

        console.log('Changes pushed successfully');
    } catch (err) {
        console.error('Error pushing changes:', err);
    }
}

module.exports = { pushChanges };
