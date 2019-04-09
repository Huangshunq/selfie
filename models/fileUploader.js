const fs = require('fs');
const path = require('path');
const { publicPath, uploadDir } = require('../defaultConfig');
const getNameByDate = require('./videoUtils').getNameByDate;

function save(filePath, fileType) {
  // 创建可读流
  const reader = fs.createReadStream(filePath);
  const filename = getNameByDate(fileType);
  const outputFilePath = path.join(publicPath, uploadDir, filename);
  // 创建可写流
  const upStream = fs.createWriteStream(outputFilePath);

  return new Promise((resolve, reject) => {
    reader.on('error', err => {
      reject(err);
    });
    reader.on('end', () => {
      resolve();
    });
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  });
};

function saveFiles(files) {
  let promiseArr = [];
  for (let file of files) {
    promiseArr.push(save(file.path, file.type));
  }
  return Promise.all(promiseArr);
}

module.exports = {
  save, saveFiles
};
