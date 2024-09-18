require('dotenv').config();
const express = require('express');
const path = require('path');
const { main } = require('./utils/main');
const logRoutes = require('./routes/logs');
const loginRoutes = require('./routes/login');
const basicAuth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const { pushChanges } = require('./utils/gitHelper');
const { formatDate, formatTime } = require('./utils/date&TimeFormatter');

setInterval(async () => {
    await pushChanges('Scheduled commit');
    const nextCommitDate = new Date(Date.now() + 1000 * 60 * 60 * 6);
    const date = formatDate(nextCommitDate);
    const time = formatTime(nextCommitDate);
    console.log(`Next commit scheduled for \x1b[33m${date}\x1b[0m at \x1b[33m${time}\x1b[0m`);
}, 5000);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    res.status(200).json({
        status: 'Service is running'
    });
});

app.use('/logs', basicAuth, logRoutes);
app.use(loginRoutes);

app.listen(process.env.PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server is running on port ${process.env.PORT}\n`);
});

main();
