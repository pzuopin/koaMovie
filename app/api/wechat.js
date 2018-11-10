const WeChat = require('../../wechat').getWeChat();
const WeChatOAuth = require('../../wechat').getWeChatOAuth();
const { Sign } = require('../../wechat-lib/util');

exports.getSignature = async (url) => {
    const Token = await WeChat.fetchAccessToken().access_token;
    const Ticket = await WeChat.fetchTicket(Token).ticket;
    let params = Sign(Ticket, url);
    params.appId = WeChat.appID;

    return params;
};

exports.getAuthorizeUrl = (scope, target, state) => {
    let url = WeChatOAuth.getAuthorizeUrl(scope, target, state);
    return url;
};

exports.getUserInfo = async (code, lang="zh_CN") => {
    const TokenData = await WeChatOAuth.fetchAccessToken(code);
    const UserData = await WeChatOAuth.getUserInfo(TokenData.access_token, TokenData.openid, lang);
    return UserData;
};