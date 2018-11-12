const Config = require('../config');
const WeChat = require('../app/controllers/wechat');
const User = require('../app/controllers/user');

module.exports = router => {
    router.get(Config.URL_PREFIX + '/wx-hear', WeChat.hear);
    router.post(Config.URL_PREFIX + '/wx-hear', WeChat.hear);
    router.get(Config.URL_PREFIX + '/wx-oauth', WeChat.oauth);
    router.get(Config.URL_PREFIX + '/userInfo', WeChat.userInfo);
    router.get(Config.URL_PREFIX + '/sdk', WeChat.sdk);

    router.get(Config.URL_PREFIX + '/user/signUp', User.showSignUp);
    router.get(Config.URL_PREFIX + '/user/signIn', User.showSignIn);
    router.post(Config.URL_PREFIX + '/user/signUp', User.signUp);
    router.post(Config.URL_PREFIX + '/user/signIn', User.signIn);
    router.get(Config.URL_PREFIX + '/user/logOut', User.logOut);
};