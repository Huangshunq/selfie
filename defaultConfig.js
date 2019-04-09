const path = require('path');
const os = require('os');

module.exports = {
  // movie滤镜在 Windows下似乎不支持输入路径为绝对路径。
  // 因为 Windows下文件的绝对路径其中开头的盘符后面跟着一个“:”。
  // “:”在 Filter中被解析成参数的分隔符，
  // 导致绝对路径被解析为 2个参数，最后造成错误。
  watermarkPath: os.platform() === 'win32'
                  ? './watermark/img.png'
                  : path.resolve('./watermark/img.png'),
  publicPath: path.resolve('./public'),
  uploadDir: 'videos',
  imageDir: 'images'
};
