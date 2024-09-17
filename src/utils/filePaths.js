const path = require('path');
const resolvePath = (folder, filename) => path.join(__dirname, '..', folder, filename);

const paths = {
    chatIdsPathIOE: resolvePath('ioe', 'IOEChatIds.json'),
    chatIdsPathIOM: resolvePath('iom', 'IOMChatIds.json'),
    IOMExamNoticesPath: resolvePath('iom', 'IOM_Exam_Notices.json'),
    IOEExamNoticesPath: resolvePath('ioe', 'IOE_Exam_Notices.json'),
    IOEEntranceNoticesPath: resolvePath('ioe', 'IOE_Entrance_Notices.json'),
    IOEOfficialPageNoticesPath: resolvePath('ioe', 'IOE_Official_Page_Notices.json'),
    IOEAdmissionNoticesPath: resolvePath('ioe', 'IOE_Admission_Notices.json')
}

module.exports = paths;