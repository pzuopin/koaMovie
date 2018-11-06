const sha1 = require('sha1');

module.exports = (opts)=>{
    return async (context, next)=>{
        console.log(context.query);
        const {
            signature,
            timestamp,
            nonce,
            echostr
        } = context.query;
        const token = opts.Token;
        let str = [token, timestamp, nonce].sort().join('');
        const sha = sha1(str); 
        if("GET" === context.method){
            if(sha === signature){
                context.body = echostr;
            }else{
                context.body = "Falied";
            }            
        }else if("POST" === context.method){
            if(sha !== signature){
                return (context.body = "Falied");
            }
        }
    };
};