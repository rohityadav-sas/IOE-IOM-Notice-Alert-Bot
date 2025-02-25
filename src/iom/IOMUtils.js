const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../utils/date&TimeFormatter');

async function examIOM() {
	try {
		console.log('Fetching IOM exam notices');
		const currentNotices = [];
		const result = await axios.get(
			'https://iomexam.edu.np/index.php/exam/results'
		);
		const $ = cheerio.load(result.data);
		const table = $('.table.table-striped.table-bordered.dTableR tbody');
		for (let i = 0; i < 5; i++) {
			const row = table.eq(i);
			const description = row.find('td').eq(2).text().trim();
			const url = row.find('td').eq(3).find('a').attr('href');
			let date = row.find('td').eq(0).text().trim();
			date = formatDate(date);
			currentNotices.push({ Date: date, Description: description, Url: url });
		}
		console.log('IOM exam notices fetched successfully');
		return currentNotices;
	} catch (err) {
		console.error(`Error fetching exam notices for IOM: ${err.response.data}`);
		return [];
	}
}

async function officialIOM() {
	try {
		console.log('Fetching IOM official notices');
		const currentNotices = [];
		const notice = await axios.get(
			'https://iomexam.edu.np/index.php/pages/news_notices/notices'
		);
		const $ = cheerio.load(notice.data);
		const table = $('.news-listing');
		for (let i = 0; i < 5; i++) {
			const row = table.eq(i);
			const href = row.find('a.btn').attr('href');
			const noticePage = await axios.get(href);
			const $$ = cheerio.load(noticePage.data);
			const description = $$('.span12 h2').text().trim();
			let date = $$('.date').text().trim();
			date = formatDate(date);
			let url = $$('.date').siblings('p').find('a').attr('href');
			if (!url) {
				url = $$('.modal-body img').attr('src');
			}
			currentNotices.push({ Date: date, Description: description, Url: url });
		}
		console.log('IOM official notices fetched successfully');
		return currentNotices;
	} catch (err) {
		console.error(
			`Error fetching official notices for IOM: ${err.response.data}`
		);
		return [];
	}
}

async function routineIOM() {
	try {
		console.log('Fetching IOM routine notices');
		const currentNotices = [];
		const result = await axios.get(
			'https://iomexam.edu.np/index.php/exam/routines'
		);
		const $ = cheerio.load(result.data);
		const table = $('.table.table-striped.table-bordered.dTableR tbody');
		for (let i = 0; i < 5; i++) {
			const row = table.eq(i);
			const description = row.find('td').eq(2).text().trim();
			const url = row.find('td').eq(3).find('a').attr('href');
			let date = row.find('td').eq(0).text().trim();
			date = formatDate(date);
			currentNotices.push({ Date: date, Description: description, Url: url });
		}
		console.log('IOM routine notices fetched successfully');
		return currentNotices;
	} catch (err) {
		console.error(
			`Error fetching routine notices for IOM: ${err.response.data}`
		);
		return [];
	}
}

async function fetchCurrentNoticesIOM(noticeType) {
	if (noticeType === 'exam') {
		return await examIOM();
	} else if (noticeType === 'official') {
		return await officialIOM();
	} else if (noticeType === 'routine') {
		return await routineIOM();
	}
}

module.exports = { fetchCurrentNoticesIOM };
