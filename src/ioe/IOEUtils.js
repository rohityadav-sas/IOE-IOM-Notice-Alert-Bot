const axios = require('axios');
const cheerio = require('cheerio');

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
        let currentNotices = [];
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
    catch (error) {
        console.error(error);
    }
}

//IOE: https://pcampus.edu.np/
async function officialIOE() {
    try {
        let currentNotices = [];
        let response = await axios.get('https://pcampus.edu.np/');
        let $ = cheerio.load(response.data);
        let table = $('#recent-posts-2 ul li');
        for (let i = 0; i < table.length; i++) {
            let row = table.eq(i);
            const fullNoticeUrl = row.find('a').attr('href');
            const fullNoticePage = await axios.get(fullNoticeUrl);
            const $notice = cheerio.load(fullNoticePage.data);
            const description = $notice('.post-inner-content header h1.entry-title').text().trim();
            const url = $notice('.post-inner-content .entry-content p a').attr('href');
            let date = $notice('.post-inner-content header time.entry-date').text().trim();
            const match = date.match(/(\w+ \d{1,2}, \d{4})/);
            if (match) {
                const extractedDate = new Date(match[0]);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                date = new Intl.DateTimeFormat('en-US', options).format(extractedDate);
            }
            currentNotices.push({ Date: date, Description: description, Url: url });
        }
        return currentNotices;
    }
    catch (error) {
        console.error(error);
    }
}


async function fetchCurrentNoticesIOE(noticeType) {
    if (noticeType === 'exam') {
        return await examIOE();
    } else if (noticeType === 'entrance') {
        return await entranceIOE();
    }
    else if (noticeType === 'official') {
        return await officialIOE();
    }
}

module.exports = { fetchCurrentNoticesIOE };