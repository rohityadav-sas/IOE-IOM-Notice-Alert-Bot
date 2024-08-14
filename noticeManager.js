const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function fetchCurrentNotices() {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.get('http://www.iomexam.edu.np/index.php/exam/results');
            const $ = cheerio.load(result.data);
            const table = $('.table.table-striped.table-bordered.dTableR tbody');
            const currentNotices = [];
            for (let i = 0; i < 10; i++) {
                const row = table.eq(i);
                const date = row.find('td').eq(0).text().trim();
                const title = row.find('td').eq(1).text().trim();
                const url = row.find('td').eq(3).find('a').attr('href');
                currentNotices.push({ Date: date, Title: title, Url: url });
            }
            resolve(currentNotices);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function fetchSavedNotices() {
    try {
        if (!fs.existsSync(path.join(__dirname, '/assets/savedNotices.json'))) {
            fs.writeFileSync(path.join(__dirname, '/assets/savedNotices.json'), '[]');
        }
        const data = fs.readFileSync(path.join(__dirname, '/assets/savedNotices.json'), 'utf-8');
        if (data.length === 0) { return [] };
        return JSON.parse(data);
    }
    catch (err) {
        throw (err);
    }
}

async function saveNotices(notices) {
    fs.writeFileSync(path.join(__dirname, "/assets/savedNotices.json"), JSON.stringify(notices, null, 2));
}

async function checkForNewNotices(currentNotices, savedNotices) {
    const newNotices = currentNotices.filter((notice) =>
        !savedNotices.some(savedNotice =>
            savedNotice.Date === notice.Date &&
            savedNotice.Title === notice.Title
        )
    );
    if (newNotices.length > 0) {
        savedNotices.unshift(...newNotices);
        saveNotices(savedNotices);
        return newNotices;
    }
    else {
        return [];
    }
}

module.exports = { fetchCurrentNotices, fetchSavedNotices, checkForNewNotices };