const simpleGit = require('simple-git');
const git = simpleGit();
require('dotenv').config();

async function pushChanges(message) {
    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        if (!GITHUB_TOKEN) {
            throw new Error('GITHUB_TOKEN environment variable is not set.');
        }

        const remoteUrl = `https://${GITHUB_TOKEN}@github.com/username/repository.git`;

        const remotes = await git.getRemotes();
        const remoteExists = remotes.some(remote => remote.name === 'origin');

        if (remoteExists) {
            await git.remote(['set-url', 'origin', remoteUrl]);
        } else {
            await git.addRemote('origin', remoteUrl);
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
