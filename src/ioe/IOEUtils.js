const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../utils/date&TimeFormatter');

const axiosInstance = axios.create({
	proxy: {
		protocol: 'http',
		host: '38.54.71.67',
		port: 80
	},
	timeout: 20000
});

// IOE: http://exam.ioe.edu.np/
async function examIOE() {
	try {
		console.log('Fetching IOE exam notices');
		let currentNotices = [];
		const result = await axiosInstance.get('http://exam.ioe.edu.np/');
		const $ = cheerio.load(result.data);
		const table = $('#datatable tbody tr');
		for (let i = 0; i < 5; i++) {
			const row = table.eq(i);
			const date = row.find('td').eq(2).text().trim();
			const description = row.find('td').eq(1).text().trim();
			const url =
				'http://exam.ioe.edu.np' +
				row.find('td').eq(3).find('a').eq(1).attr('href');
			currentNotices.push({ Date: date, Description: description, Url: url });
		}
		console.log('IOE exam notices fetched successfully');

		return currentNotices;
	} catch (error) {
		if (error.response && error.response.status === 502) {
			console.error('Server down for IOE exam notices');
		} else if (error.code === 'ECONNABORTED') {
			console.error('Connection timeout for IOE exam notices');
		} else {
			console.error(error);
		}
	}
}

// IOE: https://entrance.ioe.edu.np/
async function entranceIOE() {
	try {
		console.log('Fetching IOE entrance notices');

		let currentNotices = [];
		const result = await axiosInstance.get(
			'https://entrance.ioe.edu.np/Notice'
		);
		const $ = cheerio.load(result.data);
		const table = $('table.table.table-bordered tbody tr');
		for (let i = 0; i < table.length; i++) {
			const row = table.eq(i);
			const fullNoticeUrl =
				'https://entrance.ioe.edu.np' +
				row.find('td').eq(3).find('a').attr('href');
			const fullNoticePage = await axios.get(fullNoticeUrl);
			const $notice = cheerio.load(fullNoticePage.data);
			const date = $notice('.label.label-info')
				.text()
				.trim()
				.replace('Published Date: ', '');
			const description = $notice('.well p')
				.text()
				.trim()
				.replace(/ - Click Here.*$/, '')
				.trim();
			const url = $notice('.well p a').attr('href');
			currentNotices.push({ Date: date, Description: description, Url: url });
		}
		console.log('IOE entrance notices fetched successfully');

		return currentNotices;
	} catch (error) {
		if (error.response && error.response.status === 502) {
			console.error('Server down for IOE entrance notices');
		} else if (error.code === 'ECONNABORTED') {
			console.error('Connection timeout for IOE entrance notices');
		} else {
			console.error(error);
		}
	}
}

//IOE: https://pcampus.edu.np/
async function officialIOE() {
	try {
		console.log('Fetching IOE pcampus notices');

		let currentNotices = [];
		let response = await axios.get('https://pcampus.edu.np/');
		let $ = cheerio.load(response.data);
		let table = $('#recent-posts-2 ul li');
		for (let i = 0; i < table.length; i++) {
			let row = table.eq(i);
			const fullNoticeUrl = row.find('a').attr('href');
			const fullNoticePage = await axios.get(fullNoticeUrl);
			const $notice = cheerio.load(fullNoticePage.data);
			const description = $notice('.post-inner-content header h1.entry-title')
				.text()
				.trim();
			const url = $notice('.post-inner-content .entry-content p a').attr(
				'href'
			);
			if (!url.includes('pcampus.edu.np')) {
				continue;
			}
			let date = $notice('.post-inner-content header time.entry-date')
				.text()
				.trim();
			const match = date.match(/(\w+ \d{1,2}, \d{4})/);
			if (match) {
				date = formatDate(match[0]);
			}
			currentNotices.push({ Date: date, Description: description, Url: url });
		}
		console.log('IOE pcampus notices fetched successfully');

		return currentNotices;
	} catch (error) {
		if (error.response && error.response.status === 502) {
			console.error('Server down for IOE pcampus notices');
		} else if (error.code === 'ECONNABORTED') {
			console.error('Connection timeout for IOE pcampus notices');
		} else {
			console.error(error);
		}
	}
}

//IOE: https://admission.ioe.edu.np
async function admissionIOE() {
	try {
		console.log('Fetching IOE admission notices');

		let currentNotices = [];
		const result = await axiosInstance.get('https://admission.ioe.edu.np', {
			maxRedirects: 10
		});
		const $ = cheerio.load(result.data);
		const table = $('table.table.table-bordered tbody tr');
		for (let i = 0; i < table.length; i++) {
			const row = table.eq(i);
			const description = row.find('td').eq(1).text().trim();
			let date = row.find('td').eq(2).text().trim();
			date = formatDate(date);
			const fullUrlPage =
				'https://admission.ioe.edu.np' +
				row.find('td').eq(3).find('a').attr('href');
			const fullNoticePage = await axios.get(fullUrlPage);
			const $url = cheerio.load(fullNoticePage.data);
			let url = $url('.ibox-content .row a').attr('href');
			if (url === undefined) {
				url = fullUrlPage;
			}
			currentNotices.push({ Date: date, Description: description, Url: url });
		}
		console.log('IOE admission notices fetched successfully');
		return currentNotices;
	} catch (error) {
		if (error.response && error.response.status === 502) {
			console.error('Server down for IOE admission notices');
		} else if (error.code === 'ERR_FR_TOO_MANY_REDIRECTS') {
			console.error('Too many redirects for IOE admission notices');
		} else if (error.code === 'ECONNABORTED') {
			console.error('Connection timeout for IOE admission notices');
		} else {
			console.error(error);
		}
	}
}

async function fetchCurrentNoticesIOE(noticeType) {
	if (noticeType === 'exam') {
		return await examIOE();
	} else if (noticeType === 'entrance') {
		return await entranceIOE();
	} else if (noticeType === 'official') {
		return await officialIOE();
	} else if (noticeType === 'admission') {
		return await admissionIOE();
	}
}

module.exports = { fetchCurrentNoticesIOE };
