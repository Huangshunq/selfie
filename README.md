# selfie-backend

## 1.搭建后台结构

* controllers: 处理请求的函数
* lib：处理器函数库
* middleware：中间件
* models：返回数据的模块
* public：静态目录
* router：路由器
* app.js：入口文件

<!-- logs：输出日志 -->

## 2.路由选择

* 获取列表相关
  * GET /list 获取文件列表
* 上传文件相关
  * POST /file 上传一个文件
  * POST /files 上传多个文件

## 3.历史修改

* v1.1.0
  * 使用 koa-body 代替 koa-bodyparser [参考博文](http://www.ptbird.cn/koa-body.html)
  * 新添加上传文件相关功能
