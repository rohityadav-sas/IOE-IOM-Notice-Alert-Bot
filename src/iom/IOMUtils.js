const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../utils/date&TimeFormatter');

async function fetchCurrentNoticesIOM() {
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
		console.error(`Error fetching notices for IOM: ${err.response.data}`);
		return [];
	}
}

module.exports = { fetchCurrentNoticesIOM };
