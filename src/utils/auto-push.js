const simpleGit = require('simple-git');
const path = require('path');

const repoPath = path.resolve(__dirname, '..', '..');
const git = simpleGit(repoPath);

async function pushChanges() {
    try {
        const status = await git.status();
        if (status.files.length === 0) {
            console.log('No changes detected');
            return;
        }
        await git.add('.');
        await git.commit('Auto-commit: Changes detected');
        await git.push('origin', 'master');

        console.log('Changes pushed to GitHub successfully');
    } catch (err) {
        console.error('Error pushing changes:', err);
    }
}

pushChanges();
