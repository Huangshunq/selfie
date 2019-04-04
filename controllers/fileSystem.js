/*
* 读取文件列表相关
* GET /list 读取文件列表
*/
const fileList = require('../models/fileList');

function getCurrentPageList(list, currentPage, pageSize) {
  if (currentPage < 1 || pageSize < 1) {
    return [];
  }
  return list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
}

const getListFn = async (ctx, next) => {
  const { dir, pageSize, currentPage } = ctx.query;
  let resData = {}, tempData = {};

  // 未指定每页显示的数据 pageSize，
  // 则设置后台数据总数 count 为 pageSize，
  // 并设置当前页为 1。
  if (!pageSize) {
    resData.pageSize = resData.count;
    resData.currentPage = 1;
  } else {
  // 指定了 pageSize 则设置 pageSize。
    resData.pageSize = pageSize;
  // 未指定 currentPage 则设为 1。
    if (!currentPage) {
      resData.currentPage = 1;
    } else {
      resData.currentPage = currentPage;
    }
  }

  try {
    if (!dir) {
      tempData = await fileList.getAll()
                      .then(allArr => {
                        resData.count = Object.values(allArr[0])[0].length; // 数据总数
                        return allArr.reduce((previousObj, currentObj) => {
                          return Object.assign(previousObj, currentObj);
                        });
                      });
      Object.keys(tempData).map(dirName => {
        resData[dirName] = getCurrentPageList(tempData[dirName], resData.currentPage, resData.pageSize);
      });
    } else {
      tempData = await fileList.get(dir)
                      .then(filesArr => {
                        resData.count = filesArr.length; // 数据总数
                        return {
                          [dir]: filesArr
                        };
                      });
      resData[dir] = getCurrentPageList(tempData[dir], resData.currentPage, resData.pageSize);
    }
  } catch (err) {
    console.log(err);
    if (err.errno === -4058) {
      ctx.state.error({ message: 'no such directory' });
    } else if (err.errno === -4052) {
      ctx.state.error({ message: 'not a directory' });
    } else {
      ctx.state.error({ message: err.message });
    }
    await next();
    return;
  }
  
  ctx.state.success(resData);
  await next();
};

module.exports = {
  getListFn
};
