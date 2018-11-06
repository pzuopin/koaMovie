const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const TokenSchema = new Schema({
    name: String,
    token: String,
    expires_in: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now(),
        },        
    },
});
TokenSchema.pre('save', (next)=>{
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
}); 
TokenSchema.statics = {
    async getAccessToken(){
        const Token = await this.findOne({
            name: 'access_token'
        });
        if(Token && Token.token){
            Token.access_token = Token.token;
        }
        return Token;
    },
    async saveAccessToken(data){
        let token = await this.findOne({
            name: 'access_token'
        });
        if(token){
            token.token = data.access_token;
            token.expires_in = data.expires_in;
        }else{
            token = new Token({
                name: 'access_token',
                token: data.access_token,
                expires_in: data.expires_in,
            });
        }
        await token.save();
        return data;
    },
};
const Token = Mongoose.model('Token', TokenSchema, 'tokens');