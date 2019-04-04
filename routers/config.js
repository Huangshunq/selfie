const { getListFn } = require('../controllers/fileSystem');

module.exports = {
// 获取列表相关
    'GET /list'           : getListFn,
};
