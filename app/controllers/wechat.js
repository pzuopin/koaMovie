const Reply = require('../../wechat/reply');
const Config = require('../../config');
const WeChatMiddleware = require('../../wechat-lib/middleware');
const WeChatOAuth = require('../../wechat').getWeChatOAuth();

exports.hear = async (context, next) => {
    const Middleware = WeChatMiddleware(Config.WECHAT, Reply);
    await Middleware(context, next);
};

exports.oauth = async (context, next) => {
    let target = Config.BASE_URL + '/userInfo';
    let scope = 'snsapi_userinfo';
    let state = context.query.id;
    
    let url = WeChatOAuth.getAuthorizeUrl(scope, target, state);

    context.redirect(url);
};

exports.userInfo = async (context, next) => {
    const Code = context.query.code;
    const TokenData = await WeChatOAuth.fetchAccessToken(Code);
    const UserData = await WeChatOAuth.getUserInfo(TokenData.access_token, TokenData.openid);

    context.body = UserData;
};