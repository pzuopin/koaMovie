const Config = require('../config');
const WeChat = require('../app/controllers/wechat');
const User = require('../app/controllers/user');
const Index = require('../app/controllers/index');
const Category = require('../app/controllers/movie/category');

module.exports = router => {
    router.get(Config.URL_PREFIX + '/', Index.homePage);

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

    router.get(Config.URL_PREFIX + '/admin/user/list', User.signInRequired, User.adminRequired, User.list);

    router.get(Config.URL_PREFIX + '/admin/movie/category/show', User.signInRequired, User.adminRequired, Category.show);
    router.get(Config.URL_PREFIX + '/admin/movie/category/update/:_id', User.signInRequired, User.adminRequired, Category.show);
    router.post(Config.URL_PREFIX + '/admin/movie/category', User.signInRequired, User.adminRequired, Category.new);
    router.get(Config.URL_PREFIX + '/admin/movie/category/list', User.signInRequired, User.adminRequired, Category.list);
};