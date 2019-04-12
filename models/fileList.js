const fs = require('fs');
const path = require('path');
const publicPath = require('../config').publicPath;

const promisify = function (nodeFunc) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      nodeFunc.call(this, ...args, (err, data) => {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
};

const readDir = promisify(fs.readdir),
      fileStat = promisify(fs.stat);

// 获得路径下所有文件
// isDir 是否要返回文件夹，而不是文件
async function get(dirName, isDir) {
  try {
    const dirPath = path.join(publicPath, dirName);
    const files = await readDir(dirPath);
    let promiseArr = files.map(async file => {
      const filePath = path.join(dirPath, file);
      const stat = await fileStat(filePath);
      if (!isDir && stat.isFile()) {
        return file;
      } else if (isDir && stat.isDirectory()) {
        return file;
      }
    });
    return Promise.all(promiseArr)
            .then(arr => arr.filter(f => f).reverse());
  } catch (err) {
    throw err;
  }
}

async function getAll() {
  try {
    const dirArr = await get('./', true);
    const promiseArr = dirArr.map(async dirName => {
      const fileArr = await get(dirName, false);
      return {
        [dirName]: fileArr
      };
    });
    return Promise.all(promiseArr);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  get, getAll
};
