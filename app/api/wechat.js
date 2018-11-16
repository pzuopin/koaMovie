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

exports.saveMpUser = async (message, from='')=>{
    let sceneId = message.EventKey;
    let openid = message.FromUserName;
    let count = 0;
    if (sceneId && sceneId.indexOf('qrscene_') > -1) {
      sceneId = sceneId.replace('qrscene_', '');
    }
    let user = await User.findOne({
      openid: openid,
    });
    let mp = require('../../wechat/index');
    let client = mp.getWeChat();
    let userInfo = await client.handle('getUserInfo', openid);
    if ('koaMovie' === sceneId) {
      from = 'koaMovie';
    }
    if (!user) {
      let userData = {
        from: from,
        openid: [userInfo.openid],
        unionid: userInfo.unionid,
        nickname: userInfo.nickname,
        email: (userInfo.unionid || userInfo.openid) + '@wx.com',
        province: userInfo.province,
        country: userInfo.country,
        city: userInfo.city,
        gender: userInfo.gender,
      };
      user = new User(userData);
      user = await user.save();
    }
    if ('koaMovie' === from) {
      let tagid;
      count = await User.count({
        from: 'koaMovie',
      });
      try {
        let tagsData = await client.handle('fetchTags');
        tagsData = tagsData || {};
        let tags = tagsData.tags || [];
        let filteredTags = tags.filter(tag => {
          return 'koaMovie' === tag.name;
        });
        if (filteredTags && filteredTags.length > 0) {
          tagid = filteredTags[0].id;
          count = filteredTags[0].count || 0;
        } else {
          let res = await client.handle('createTag', 'koaMovie');
          tagid = res.tag.id;
        }
        if (tagid) {
          await client.handle('batchUsersTag', [openid], tagid);
        }
      } catch (err) {
        console.log(err);
      }
    }
    return {
      user,
      count,
    };
}