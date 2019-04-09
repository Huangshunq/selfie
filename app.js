const Koa = require('koa'),
      app = new Koa(),
      koaBody = require('koa-body'),
      serve = require('koa-static'),
      binding = require('./middleware/binding'),
      filter = require('./middleware/filter'),
      route = require('./routers'),
      publicPath = require('./defaultConfig').publicPath;

app.use(koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true,
    hash: 'sha1'
  }
}));
app.use(serve(publicPath));
app.use(binding());
app.use(filter());
app.use(route());

if (process.env.NODE_ENV === 'development') {
  const logger = require('koa-logger');
  app.use(logger());

  app.listen(8081, '192.168.3.15', () => {
      console.log('listening on 192.168.3.15:8081......');
  });

  module.exports = app;
} else if (process.env.NODE_ENV === 'production') {
  app.listen(8081, '127.0.0.1', () => {
      console.log('listening on port 8081......');
  });
} else {
  console.log('启动场景未知！');
}
