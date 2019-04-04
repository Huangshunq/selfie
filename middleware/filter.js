const xssFilter = require('../lib/xssFilter');
const fileLogger = require('../lib/fileLogger');

module.exports = () => async (ctx, next) => {
    ctx.request.body = xssFilter(ctx.request.body);

    try {
        fileLogger.info({
            method: ctx.req.method,
            url: ctx.req.url,
            headers: ctx.req.headers
        });
        await next();
    } catch (err) {
        console.log(err.stack);
        fileLogger.error({
            code: err.code,
            message:err.name,
            stack: err.stack
        });
        ctx.state.error({ message: err.name });
    }
}