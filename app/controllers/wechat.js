const Reply = require('../../wechat/reply');
const Config = require('../../config');
const WeChatMiddleware = require('../../wechat-lib/middleware');
const Api = require('../api');
const { UrlJoin, IsWeChat } = require('../util');

exports.hear = async (context, next) => {
    const Middleware = WeChatMiddleware(Config.WECHAT, Reply);
    await Middleware(context, next);
};

exports.oauth = async (context, next) => {
    let target = Config.BASE_URL + '/userInfo';
    let scope = 'snsapi_userinfo';
    let state = context.query.id;
    
    let url = Api.wechat.getAuthorizeUrl(scope, target, state);

    context.redirect(url);
};

exports.userInfo = async (context, next) => {
    const Code = context.query.code;
    const UserData = await Api.wechat.getUserInfo(Code);

    context.body = UserData;
};

exports.sdk = async (context, next) => {
    const Url = UrlJoin(Config.BASE_URL, context.originalUrl);
    const Params = await Api.wechat.getSignature(Url);
    await context.render('wechat/sdk', Params);
};

exports.checkWechat = async (context, next)=>{
    const Code = context.query.code;
    const Ua = context.headers['user-agent'];
    if("GET" === context.method){
        if(Code){
            await next();
        }else if(IsWeChat(Ua)){
            let target = UrlJoin(Config.BASE_URL, context.originalUrl);
            let scope = 'snsapi_userinfo';
            let Url = Api.wechat.getAuthorizeUrl(scope, target, 'fromWeChat');
            context.redirect(Url);
        }else{
            await next();
        }
    }else{
        await next();
    }
};

exports.wechatReDirect = async (context, next)=>{
    let {code, state} = context.query;
    if(code && "fromWeChat" == state){
        const UserData = await Api.wechat.getUserInfo(code);
        let user = await Api.wechat.saveWeChatUser(UserData);
        context.session.user = {
            _id: user._id,
            nickname: user.nickname,
            role: user.role,
        };
        context.state = Object.assign(context.state, {
            user: {
              _id: user._id,
              role: user.role,              
              nickname: user.nickname,
            },
        });
    }
    await next();
};