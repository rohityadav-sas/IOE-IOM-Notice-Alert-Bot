const simpleGit = require('simple-git');
const git = simpleGit();
require('dotenv').config();

async function pushChanges(message) {
    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        if (!GITHUB_TOKEN) {
            throw new Error('GITHUB_TOKEN environment variable is not set.');
        }

        const remoteUrl = `https://${GITHUB_TOKEN}@github.com/rohityadav-sas/IOE-IOM-Notice-Alert.git`;

        const remotes = await git.getRemotes();
        console.log('Current remotes:', remotes);
        const remoteExists = remotes.some(remote => remote.name === 'origin');

        if (remoteExists) {
            await git.remote(['set-url', 'origin', remoteUrl]);
        } else {
            await git.addRemote('origin', remoteUrl);
        }

        const status = await git.status();
        console.log('Git status:', status);

        await git.add('./*');
        await git.commit(message);

        const result = await git.push('origin', 'main');
        console.log('Push result:', result);

        console.log('Changes pushed successfully');
    } catch (err) {
        console.error('Error pushing changes:', err);
    }
}

module.exports = { pushChanges };

