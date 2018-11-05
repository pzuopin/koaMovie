/*
 * @file:  check.js
 * @brief:  微信公众号配置服务器接入与认证
 * @author: feihu1996.cn
 * @date:  18.11.05
 * @version: 1.0
*/

const Koa = require('koa');
const sha1 = require('sha1');
const config = {
    weChat: {
        appID: 'wx7133a141a07ad68e',
        appSecret: '5a75ba91019359dfd67ed6389744d9ba',
        token: '70pJmQ6EfGkNYc9YhXzCi8l8j42K72eE',
    },
};

// 生成服务器实例
const app = new Koa();

// 加载认证中间件
// context 是Koa的应用上下文
// next 就是串联中间件的钩子函数
app.use(async (context, next)=>{
    const {
        signature,
        timestamp,
        nonce,
        echostr
    } = context.query;
    const token = config.weChat.token;
    let str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str); 
    if(sha === signature){
        context.body = echostr;
    }else{
        context.body = "wrong";
    }
});

app.listen(8091, ()=>{
    console.log(`Server running at http://0.0.0.0:8091`);
});