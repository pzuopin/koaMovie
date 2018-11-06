const Koa = require('koa');
const WeChat = require('./wechat-lib/middleware');
const Config = require('./config');
const Reply = require('./wechat/reply');
const { InitSchemas, Connect } = require('./app/database/init');

(async ()=>{
    await Connect(Config.MONGODB);
    
    InitSchemas();

    let { test } = require('./wechat');
    await test();

    const App = new Koa();

    App.use(WeChat(Config.WECHAT, Reply));
    
    App.listen(Config.PORT, ()=>{
        console.log(`Server running at http://0.0.0.0:${Config.PORT}`);
    });
})();