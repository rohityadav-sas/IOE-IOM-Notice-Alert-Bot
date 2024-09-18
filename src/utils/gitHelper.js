const simpleGit = require('simple-git');
const path = require('path');
require('dotenv').config();

const git = simpleGit(path.resolve(__dirname, '..', '..'));
const remote = `https://${process.env.GITHUB_TOKEN}@github.com/rohityadav-sas/IOE-IOM-Notice-Alert-Bot.git`;

async function pushChanges(commitMessage) {
    try {
        await git.add('.');
        await git.commit(commitMessage);
        await git.push(remote, 'master');
        console.log('Changes pushed successfully!');
    } catch (error) {
        console.error('Error pushing changes:', error);
    }
}

pushChanges('Testing simple-git');

module.exports = { pushChanges };
