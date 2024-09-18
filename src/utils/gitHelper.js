const simpleGit = require('simple-git');
const git = simpleGit();
require('dotenv').config();

async function pushChanges(message) {
    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const remoteUrl = `https://${GITHUB_TOKEN}@github.com/rohityadav-sas/IOE-IOM-Notice-Alert-Bot.git`;

        const remotes = await git.getRemotes(true);
        console.log('Current remotes:', remotes);

        const remoteExists = remotes.some(remote => remote.name === 'origin');
        if (remoteExists) {
            await git.remote(['set-url', 'origin', remoteUrl]);
        } else {
            await git.addRemote('origin', remoteUrl);
        }

        // Ensure branch is checked out and tracking properly
        await git.checkout('master'); // Adjust branch name if needed
        await git.branch(['--set-upstream-to=origin/master', 'master']); // Adjust branch name if needed

        // Ensure files are staged and committed
        await git.add('./*');
        await git.commit(message);

        // Push and capture result
        const result = await git.push('origin', 'master'); // Adjust branch name if needed
        console.log('Push result:', result);

        console.log('Changes pushed successfully');
    } catch (err) {
        console.error('Error pushing changes:', err);
    }
}

module.exports = { pushChanges };
