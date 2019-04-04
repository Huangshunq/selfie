const bunyan = require('bunyan');
const path = require('path');
const fs = require('fs');
const projectName = require('../package.json').name;

const loggerDir = path.resolve(__dirname, '../logs');

if (!fs.existsSync(loggerDir)) {
    fs.mkdirSync(loggerDir);
}

module.exports = bunyan.createLogger({
    name: projectName,
    streams: [
        {
            type: 'rotating-file',
            path: path.resolve(loggerDir, 'info.log'),
            period: '1d',
            count: 10
        },
        {
            level: 'error',
            path: path.resolve(loggerDir, 'error.log')
        }
    ]
});
