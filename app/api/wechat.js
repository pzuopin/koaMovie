const Mongoose = require('mongoose');
const WeChat = require('../../wechat').getWeChat();
const WeChatOAuth = require('../../wechat').getWeChatOAuth();
const { Sign } = require('../../wechat-lib/util');

const User = Mongoose.model('User');

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

exports.saveWeChatUser = async (UserData)=>{
    let query = {
        openid: UserData.openid,
    };
    if(UserData.unionid){
        query = {
            unionid: UserData.unionid,
        };
    }
    let user = await User.findOne(query);
    if(!user){
        user = new User({
            openid: [UserData.openid],
            unionid: UserData.unionid,
            nickname: UserData.nickname,
            email: (UserData.unionid || UserData.openid) + '@wx.com',
            province: UserData.province,
            country: UserData.country,
            city: UserData.city,
            gender: UserData.gender,
        });
        await user.save();
    }
    return user;
};