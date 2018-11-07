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
        }else if("6" === content){
            let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'), {
                type: 'video',
                description: '{"title": "吃个鸡？", "introduction": "吃个鸡？"}'
            });
            reply = {
                type: 'video',
                title: "吃个鸡？",
                description: "吃个鸡？",
                mediaId: data.media_id,
            };            
        }else if("7" === content){
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
                type: 'image',
            });
            reply = {
                type: 'image',
                mediaId: data.media_id,
            };
        }else if("8" === content){
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
                type: 'image',
            });
            let data2 = await client.handle('uploadMaterial', 'pic', resolve(__dirname, '../2.jpg'), {
                type: 'image',
            });            
            let media = {
                articles: [
                    {
                        "title": "这是服务端上传的图文 1",
                        "thumb_media_id": data.media_id,
                        "author": "Angus",
                        "digest": "没有摘要",
                        "show_cover_pic": 1,
                        "content": "点击去往我的博客",
                        "content_source_url": "http://www.feihu1996.cn",
                    },
                    {
                        "title": "这是服务端上传的图文 2",
                        "thumb_media_id": data.media_id,
                        "author": "Angus",
                        "digest": "没有摘要",
                        "show_cover_pic": 1,
                        "content": "点击去往GitHub",
                        "content_source_url": "https://github.com/",
                    },                    
                ],
            };
            let uploadData = await client.handle('uploadMaterial', "news", media, {});
            reply = {
                type: 'image',
                mediaId: data.media_id,
            };
        }else if("9" === content){
            let counts = await client.handle('countMaterial');
            let res = await Promise.all([
                client.handle('batchMaterial', {
                  type: 'image',
                  offset: 0,
                  count: 10
                }),
                client.handle('batchMaterial', {
                  type: 'video',
                  offset: 0,
                  count: 10
                }),
                client.handle('batchMaterial', {
                  type: 'voice',
                  offset: 0,
                  count: 10
                }),
                client.handle('batchMaterial', {
                  type: 'news',
                  offset: 0,
                  count: 10
                }),
            ]);
            reply = `
            image: ${res[0].total_count}
            video: ${res[1].total_count}
            voice: ${res[2].total_count}
            news: ${res[3].total_count}
            `            
        }else if("兰洁" === content){
            reply = "兰洁，我喜欢你";
        }
        context.body = reply;
    }
    await next();
};