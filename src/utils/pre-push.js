const { handleNotices } = require('./noticeManager');
const { fetchCurrentNoticesIOE } = require('../ioe/IOEUtils');
const { fetchCurrentNoticesIOM } = require('../iom/IOMUtils');
const paths = require('./filePaths');

handleNotices(fetchCurrentNoticesIOE('entrance'), paths.IOEEntranceNoticesPath);
handleNotices(fetchCurrentNoticesIOE('exam'), paths.IOEExamNoticesPath);
handleNotices(fetchCurrentNoticesIOE('official'), paths.IOEOfficialPageNoticesPath);
handleNotices(fetchCurrentNoticesIOE('admission'), paths.IOEAdmissionNoticesPath);

handleNotices(fetchCurrentNoticesIOM(), paths.IOMExamNoticesPath);