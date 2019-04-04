

module.exports = () => async (ctx, next) => {
    ctx.state = {
        success: (data, code = 0) => {
            ctx.body = {
                code,
                data
            };
        },
        error: (data, code = 1) => {
            ctx.body = {
                code,
                data
            };
        }
    };
    await next();
};
