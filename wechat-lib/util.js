const Xml2Js = require('xml2js');

exports.parseXML = xml => {
    return new Promise((resolve, reject)=>{
        Xml2Js.parseString(xml, {
            trim: true,
        }, (err, content)=>{
            if(err){
                reject(err);
            }else{
                resolve(content);
            }
        });
    });
};

exports.formatMessage = content =>{
    let message = {};
    if("object" === typeof content){
        const Keys = Object.keys(content);
        for(let i = 0; i < Keys.length; i++){
            let key = Keys[i];
            let item = content[key];
            if(!(item instanceof Array) || 0===item.length){
                continue;
            }
            if(1===item.length){
                let val = item[0];
                if("object" === typeof val){
                    message[key] = formatMessage(val);
                }else{
                    message[key] = (val || '').trim();
                }
            }else{
                message[key] = [];
                for(let j=0;j<item.length;j++){
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
};