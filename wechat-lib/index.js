const Fs = require('fs');
const Request = require('request-promise');
const Base = 'https://Api.weixin.qq.com/cgi-bin/';
const Api = {
    accessToken: Base + 'token?grant_type=client_credential',
    temporary: {
        upload: Base + 'media/upload?',
    },
    permanent: {
        upload: Base + 'material/add_material?',
        uploadNews: Base + 'material/add_news?',
        uploadNewsPic: Base + 'media/uploadimg?',
        fetch: Base + 'material/get_material?',
        del: Base + 'material/del_material?',
        update: Base + 'material/update_news?',
        count: Base + 'material/get_materialcount?',
        batch: Base + 'material/batchget_material?'
    },
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
            console.log(err);
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

        const Now = new Date().getTime();
        const ExpiresIn = Now + (data.expires_in - 20) * 1000;

        data.expires_in = ExpiresIn;

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
    uploadMaterial(token, type, material, permanent=false){
        let form = {};
        let url = Api.temporary.upload;

        if (permanent) {
          url = Api.permanent.upload;
          form = Object.assign(form, permanent);
        }
    
        if (type === 'pic') {
          url = Api.permanent.uploadNewsPic;
        }

        if (type === 'news') {
          url = Api.permanent.uploadNews;
          form = material;
        } else {
          form.media = Fs.createReadStream(material);
        }
    
        let uploadUrl = `${url}access_token=${token}`;
    
        if (!permanent) {
          uploadUrl += `&type=${type}`;
        } else {
          if (type !== 'news') {
            form.access_token = token;
          }
        }
        const options = {
          method: 'POST',
          url: uploadUrl,
          json: true,
        }

        if (type === 'news') {
          options.body = form;
        } else {
          options.formData = form;
        }

        return options;
    }
    fetchMaterial(token, mediaId, type, permanent){
        let form = {};
        let fetchUrl = Api.permanent.fetch;
        let url = `${fetchUrl}access_token=${token}`;
        const Options = {
            method: 'POST',
            url,
        };
        form.media_id = mediaId;
        form.access_token = token;
        Options.body = form;
        return Options;
    }
    deleteMaterial(token, mediaId){
        const Form = {
            media_id: mediaId,
        };
        let url = `${Api.permanent.del}access_token=${token}&media_id=${mediaId}`;
        return {
            method: 'POST',
            url,
            body: Form,
        };
    }
    updateMaterial(token, mediaId, news){
        let form = {
            media_id: mediaId,
        };
        form = Object.assign(form, news);
        let url = `${Api.permanent.update}access_token=${token}&media_id=${mediaId}`;
        return {
            method: 'POST',
            url,
            body: Form,
        };        
    }
    countMaterial(token){
        let url = `${Api.permanent.count}access_token=${token}`;
        return {
            Url,
        };
    }
    batchMaterial(token, options){
        options.type = options.type || 'image';
        options.offset = options.offset || 0;
        options.count = options.count || 10;

        let url = `${Api.permanent.batch}access_token=${token}`;
        
        return {
            method: 'POST',
            url,
            body: options,
        };
    }
    async handle(operation, ...args){
        const TokenData = await this.fetchAccessToken();
        const Options = this[operation](TokenData.access_token, ...args);
        const Data = await this.request(Options);
        return Data;
    }
};