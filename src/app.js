require('dotenv').config();
const express = require('express');
const path = require('path');
const { main } = require('./utils/main');
const logRoutes = require('./routes/logs');
const basicAuth = require('./middlewares/auth');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    res.status(200).send('Bot is running');
});

app.use('/logs', basicAuth, logRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server is running on port ${process.env.PORT || 3000}`);
});

main();
