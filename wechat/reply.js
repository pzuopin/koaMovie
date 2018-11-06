module.exports = async (context, next)=>{
    const Message = context.weixin;
    if('text' === Message.MsgType){
        let content = Message.Content;
        let reply = "不管怎么样，我都喜欢你～";
        if("1" === content){
            reply = "1. 我喜欢你";
        }else if("2" === content){
            reply = "2. 我喜欢你";
        }else if("3" === content){
            reply = "3. 我喜欢你";
        }else if("兰洁" === content){
            reply = "兰洁，我喜欢你"
        }
        context.body = reply;
    }
    await next();
};