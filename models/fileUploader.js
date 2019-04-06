const fs = require('fs');
const path = require('path');
const { publicPath, uploadDir } = require('../defaultConfig');

function format(dateObj, fmt) { 
  var o = { 
    'M+': dateObj.getMonth() + 1,                 //月份 
    'd+': dateObj.getDate(),                    //日 
    'h+': dateObj.getHours(),                   //小时 
    'm+': dateObj.getMinutes(),                 //分 
    's+': dateObj.getSeconds(),                 //秒 
    'q+': Math.floor((dateObj.getMonth() + 3) / 3), //季度 
    'S' : dateObj.getMilliseconds()             //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length)); 
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt; 
}

function renameFile(file) {
  let filename = Date.parse(new Date());
  switch (file.type) {
    case 'video/mpeg':
      filename = filename + '.mpeg';
      break;
    case 'video/mpg':
      filename = filename + '.mpg';
      break;
    case 'video/mp4':
      filename = filename + '.mp4';
      break;
    case 'video/mpeg4':
      filename = filename + '.mp4';
      break;
    case 'video/ogg':
      filename = filename + '.ogg';
      break;
    case 'video/webm':
      filename = filename + '.webm';
      break;
    default :
      filename = filename + '.mp4';
      break;
  }
  let now = new Date();
  now.setTime(filename.substring(0, filename.indexOf('.')));
  console.log(now, format(now, 'yyyy-MM-dd hh:mm:ss'));
  return filename;
}

function save(file) {
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  file.name = renameFile(file);
  let filePath = path.join(publicPath, uploadDir) + `/${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);

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
    promiseArr.push(save(file));
  }
  return Promise.all(promiseArr);
}

module.exports = {
  save, saveFiles
};
