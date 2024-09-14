const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchSavedNotices(filePath) {
    try {
        if (!fs.existsSync(filePath)) { fs.writeFileSync(filePath, '[]') };
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data.length === 0) { return [] };
        return JSON.parse(data);
    }
    catch (err) {
        throw (err);
    }
}

async function saveNotices(notices, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(notices, null, 2));
}

async function checkForNewNotices(currentNotices, savedNotices, filePath) {
    const newNotices = currentNotices.filter((notice) =>
        !savedNotices.some(savedNotice =>
            savedNotice.Date === notice.Date &&
            savedNotice.Description === notice.Description
        ));
    if (newNotices.length > 0) {
        savedNotices.unshift(...newNotices);
        saveNotices(savedNotices, filePath);
        return newNotices;
    }
    else {
        return [];
    }
}

async function fetchCurrentNoticesIOM() {
    try {
        const currentNotices = [];
        const result = await axios.get('http://www.iomexam.edu.np/index.php/exam/results');
        const $ = cheerio.load(result.data);
        const table = $('.table.table-striped.table-bordered.dTableR tbody');
        for (let i = 0; i < 5; i++) {
            const row = table.eq(i);
            const date = row.find('td').eq(0).text().trim();
            const description = row.find('td').eq(2).text().trim();
            const url = row.find('td').eq(3).find('a').attr('href');
            currentNotices.push({ Date: date, Description: description, Url: url });
        }
        return currentNotices;
    }
    catch (err) {
        console.error(`Error fetching notices for IOM: ${err.response.statusText}`);
        return [];
    }
}

async function fetchCurrentNoticesIOE(noticeType) {
    if (noticeType === 'exam') {
        return await examIOE();
    } else if (noticeType === 'entrance') {
        return await entranceIOE();
    }
}

// IOE: http://exam.ioe.edu.np/
async function examIOE() {
    try {
        const currentNotices = [];
        const result = await axios.get('http://exam.ioe.edu.np/');
        const $ = cheerio.load(result.data);
        const table = $('#datatable tbody tr');
        for (let i = 0; i < 5; i++) {
            const row = table.eq(i);
            const date = row.find('td').eq(2).text().trim();
            const description = row.find('td').eq(1).text().trim();
            const url = 'http://exam.ioe.edu.np' + row.find('td').eq(3).find('a').eq(1).attr('href');
            currentNotices.push({ Date: date, Description: description, Url: url });
        }
        return currentNotices;
    }
    catch (err) {
        console.error(err);
    }
}

// IOE: https://entrance.ioe.edu.np/
async function entranceIOE() {
    try {
        const currentNotices = [];
        const result = await axios.get('https://entrance.ioe.edu.np/Notice');
        const $ = cheerio.load(result.data);
        const table = $('.table.table-bordered tbody tr');
        for (let i = 0; i < table.length; i++) {
            const row = table.eq(i);
            const fullNoticeUrl = 'https://entrance.ioe.edu.np' + row.find('td').eq(3).find('a').attr('href');
            const fullNoticePage = await axios.get(fullNoticeUrl);
            const $notice = cheerio.load(fullNoticePage.data);
            const date = $notice('.label.label-info').text().trim().replace("Published Date: ", "");
            const description = $notice('.well p').text().trim().replace(/ - Click Here.*$/, '');
            const url = $notice('.well p a').attr('href');
            currentNotices.push({ Date: date, Description: description, Url: url });
        }
        return currentNotices;
    }
    catch (err) {
        console.error(err);
    }
}



module.exports = { fetchSavedNotices, checkForNewNotices, fetchCurrentNoticesIOM, fetchCurrentNoticesIOE };