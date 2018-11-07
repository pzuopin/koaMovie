let { resolve } = require('path');

module.exports = async (context, next)=>{
    const Message = context.weixin;
    
    let mp = require('../wechat');
    
    let client = mp.getWeChat();
    
    if('text' === Message.MsgType){
        let content = Message.Content;
        let reply = "不管怎么样，我都喜欢你～";
        if("1" === content){
            reply = "1. 我喜欢你";
        }else if("2" === content){
            reply = "2. 我喜欢你";
        }else if("3" === content){
            reply = "3. 我喜欢你";
        }else if("4" === content){
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'));
            reply = {
                type: 'image',
                mediaId: data.media_id,
            };
        }else if("5" === content){
            let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'));
            reply = {
                type: 'video',
                title: "回复的视频标题",
                description: "吃个鸡？",
                mediaId: data.media_id,
            };
        }else if("兰洁" === content){
            reply = "兰洁，我喜欢你";
        }
        context.body = reply;
    }
    await next();
};