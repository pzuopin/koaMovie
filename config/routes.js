const Config = require('../config');
const WeChat = require('../app/controllers/wechat');

module.exports = router => {
    router.get(Config.URL_PREFIX + '/wx-hear', WeChat.hear);
    router.post(Config.URL_PREFIX + '/wx-hear', WeChat.hear);
    router.get(Config.URL_PREFIX + '/wx-oauth', WeChat.oauth);
    router.get(Config.URL_PREFIX + '/userInfo', WeChat.userInfo);
    router.get(Config.URL_PREFIX + '/sdk', WeChat.sdk);
};