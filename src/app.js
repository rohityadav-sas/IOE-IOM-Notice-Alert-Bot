require('dotenv').config();
const express = require('express');
const path = require('path');
const { main } = require('./utils/main');
const logRoutes = require('./routes/logs');
const loginRoutes = require('./routes/login');
const basicAuth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');

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
