const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const {
  watermarkPath,
  publicPath,
  videoDir,
  imageDir
} = require('../config');

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

function getNameByDate(fileType) {
  let filename = Date.parse(new Date());
  switch (fileType) {
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
  // let now = new Date();
  // now.setTime(filename.substring(0, filename.indexOf('.')));
  // console.log(now, format(now, 'yyyy-MM-dd hh:mm:ss'));
  return filename;
}

function takeThumbnail(filePath) {
  const imageDirPath = path.join(publicPath, imageDir);
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      // .on('filenames', function(filenames) {
      //   console.log('screenshots are ' + filenames.join(', '));
      // })
      .on('end', function(stdout, stderr) {
        // console.log('takeThumbnail: Processing finished !');
        resolve(imageDirPath);
      })
      .on('error', function(err, stdout, stderr) {
        // console.log('takeThumbnail: An error occurred: ' + err.message);
        reject({ err, stdout, stderr });
      })
      .takeScreenshots({
        filename: '%b',
        count: 1,
        timemarks: [ '0' ],
      }, imageDirPath);
  });
}

function addTextWatermark(filePath, filename, text = 'hello world') {
  const videoPath = path.join(publicPath, videoDir, filename);
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions(
        '-vf',
        `drawtext=fontsize=100:fontfile=FreeSerif.ttf:text=${text}:fontcolor=green`,
        '-strict',
        '-2'
      )
      // setup event handlers
      .on('end', function(stdout, stderr) {
        // console.log('addTextWatermark: Processing finished !');
        resolve(videoPath);
      })
      .on('error', function(err, stdout, stderr) {
        // console.log('addTextWatermark: An error occurred: ' + err.message);
        reject({ err, stdout, stderr });
      })
      .save(videoPath);
  });
}

function addImageWatermark(filePath, filename, imagePath = watermarkPath) {
  const videoPath = path.join(publicPath, videoDir, filename);
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions(
        '-vf',
        `movie=${imagePath}[wm];[in][wm]overlay=0:0[out]`,
        '-strict',
        '-2'
      )
      // setup event handlers
      .on('end', function(stdout, stderr) {
        // console.log('addImageWatermark: Processing finished !');
        resolve(videoPath);
      })
      .on('error', function(err, stdout, stderr) {
        // console.log('addImageWatermark: An error occurred: ' + stderr);
        reject({ err, stdout, stderr });
      })
      .save(videoPath);
  })
}

module.exports = {
  format,
  getNameByDate,
  takeThumbnail,
  addTextWatermark,
  addImageWatermark
};
