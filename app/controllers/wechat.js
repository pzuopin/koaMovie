const Reply = require('../../wechat/reply');
const Config = require('../../config');
const WeChatMiddleware = require('../../wechat-lib/middleware');
const Api = require('../api');
const { UrlJoin } = require('../util');

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