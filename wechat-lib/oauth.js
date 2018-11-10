const Request = require('request-promise');

const Base = 'https://api.weixin.qq.com/sns/';
const Api = {
    authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
    accessToken: Base + 'oauth2/access_token?',
    userInfo: Base + 'userinfo?',
};

module.exports = class WeChatOAuth {
    constructor(opts){
        this.appID = opts.appID;
        this.appSecret = opts.appSecret;        
    }
    async request(opts){
        opts = Object.assign({}, opts, {json: true});
        try{
            const res = await Request(opts);
            return res;
        }catch(err){
            console.log(err);
        }
    }
    getAuthorizeUrl(scope='snsapi_base', target, state){
        let url = `${Api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
        return url;
    }
    async fetchAccessToken(code){
        const Url = `${Api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;
        const Res = await this.request({
            url:Url,
        });
        return Res;
    }
    async getUserInfo(token, openId, lang="zh_CN"){
        const Url = `${Api.userInfo}access_token=${token}&openid=${openId}&lang=${lang}`;
        const Res = await this.request({
            url: Url,
        });
        return Res;
    }
};