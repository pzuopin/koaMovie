const Request = require('request-promise');
const Base = 'https://api.weixin.qq.com/cgi-bin/';
const Api = {
    accessToken: Base + 'token?grant_type=client_credential',
};

module.exports = class WeChat {
    constructor (opts) {
        this.opts = Object.assign({}, opts);
        this.appID = opts.appID;
        this.appSecret = opts.appSecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;

        this.fetchAccessToken();
    }
    async request(opts){
        opts = Object.assign({}, opts, {json: true});
        try{
            const res = await Request(opts);
            return res;
        }catch(err){
            console.log(res);
        }
    }
    async fetchAccessToken(){
        let data = await this.getAccessToken();

        if(!this.isValidToken(data)){
            data = await this.updateAccessToken();
        }
        return data;
    }
    async updateAccessToken(){
        const url = `${Api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`;
        const data = await this.request({ url });

        console.log(data);

        const Now = new Date().getTime();
        const ExpiresIn = Now + (data.expires_in - 20) * 1000;

        data.expires_in = ExpiresIn;

        console.log(data);

        await this.saveAccessToken(data);

        return data;
    }
    isValidToken(data){
        if(!data || !data.expires_in){
            return false;
        }
        const ExpiresIn = data.expires_in;
        const Now = new Date().getTime();
        if(Now < ExpiresIn){
            return true;
        }else {
            return false;
        }
    }
};