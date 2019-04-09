const { getListFn, uploadFileFn, uploadFilesFn } = require('../controllers/fileSystem');

module.exports = {
// 获取列表相关
  'GET /list'           : getListFn,
// 上传文件相关
  'POST /file'          : uploadFileFn,
  // 'POST /files'         : uploadFilesFn
};
