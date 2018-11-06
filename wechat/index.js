const WeChat = require('../wechat-lib');
const Config = require('../config');
const WeChatConfig = {
    weChat: {
        appID: Config.WECHAT.AppID,
        appSecret: Config.WECHAT.AppSecret,
        token: Config.WECHAT.Token,
    },
};
(async ()=>{
    const client = new WeChat(WeChatConfig.weChat);
})()