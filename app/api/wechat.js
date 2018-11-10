const WeChat = require('../../wechat').getWeChat();
const WeChatOAuth = require('../../wechat').getWeChatOAuth();
const { Sign } = require('../../wechat-lib/util');

exports.getSignature = async (url) => {
    const TokenData = await WeChat.fetchAccessToken();
    const Token = TokenData.access_token;
    const TicketData = await WeChat.fetchTicket(Token);
    const Ticket = TicketData.ticket;
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