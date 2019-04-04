const xss = require('xss');

module.exports = function (obj) {
    if (!obj) return void(0);
    let o = {};
    for(let key in obj) {
        o[key] = xss(obj[key]);
    }
    return o;
};
