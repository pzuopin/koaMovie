# koaMovie

> Koa2 实现电影微信公众号前后端开发

## Tech Stack

- Node.js/Koa2
- MongoDB/mongoose
- 微信JS-SDK
- Pug
- JQuery/Bootstrap
- HTML/CSS
- JavaScript
- JavaScript Standard Style
- PM2
 
## Build Setup

```bash
# install dependecies
npm install

# restore backups generated with mongodump to a running server
mongorestore

# start app
npm run start

# check the style of all JavaScript files
npm run feak-precommit

# deploy setup
pm2 deploy ecosystem.yaml production setup

# deploy
pm2 deploy ecosystem.yaml production
```

## Demo Link

[http://dev.feihu1996.cn/koaMovie/](http://dev.feihu1996.cn/koaMovie/ 'koaMovie')

## 配套接口测试公众号

![接口测试公众号](./gongzhonghao.jpg "接口测试公众号")