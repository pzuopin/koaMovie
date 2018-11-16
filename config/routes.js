const Config = require('../config');
const WeChat = require('../app/controllers/wechat');
const User = require('../app/controllers/user');
const Index = require('../app/controllers/index');
const Category = require('../app/controllers/movie/category');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/movie/comment');
const KoaBody = require('koa-body');

module.exports = router => {
    router.get(Config.URL_PREFIX + '/', Index.homePage);

    router.get(Config.URL_PREFIX + '/wx-hear', WeChat.hear);
    router.post(Config.URL_PREFIX + '/wx-hear', WeChat.hear);
    router.get(Config.URL_PREFIX + '/wx-oauth', WeChat.oauth);
    router.get(Config.URL_PREFIX + '/userInfo', WeChat.userInfo);
    router.get(Config.URL_PREFIX + '/sdk', WeChat.sdk);
    router.post(Config.URL_PREFIX + '/wechat/signature', WeChat.getSdkSignature);

    router.get(Config.URL_PREFIX + '/user/signUp', User.showSignUp);
    router.get(Config.URL_PREFIX + '/user/signIn', User.showSignIn);
    router.post(Config.URL_PREFIX + '/user/signUp', User.signUp);
    router.post(Config.URL_PREFIX + '/user/signIn', User.signIn);
    router.get(Config.URL_PREFIX + '/user/logOut', User.logOut);
    router.get(Config.URL_PREFIX + '/admin/user/list', User.signInRequired, User.adminRequired, User.list);
    router.delete(Config.URL_PREFIX + '/admin/user', User.signInRequired, User.adminRequired, User.del);

    router.get(Config.URL_PREFIX + '/admin/movie/category/show', User.signInRequired, User.adminRequired, Category.show);
    router.get(Config.URL_PREFIX + '/admin/movie/category/update/:_id', User.signInRequired, User.adminRequired, Category.show);
    router.post(Config.URL_PREFIX + '/admin/movie/category', User.signInRequired, User.adminRequired, Category.new);
    router.delete(Config.URL_PREFIX + '/admin/movie/category', User.signInRequired, User.adminRequired, Category.del);
    router.get(Config.URL_PREFIX + '/admin/movie/category/list', User.signInRequired, User.adminRequired, Category.list);

    router.get(Config.URL_PREFIX + '/movie/detail/:_id', Movie.detail);
    router.post(Config.URL_PREFIX + '/movie/comment', User.signInRequired, Comment.save);
    router.get(Config.URL_PREFIX + '/movie/search', Movie.search);
    router.get(Config.URL_PREFIX + '/admin/movie/show', User.signInRequired, User.adminRequired, Movie.show);
    router.get(Config.URL_PREFIX + '/admin/movie/update/:_id', User.signInRequired, User.adminRequired,Movie.show);
    router.post(Config.URL_PREFIX + '/admin/movie', User.signInRequired, User.adminRequired, KoaBody({ multipart: true }), Movie.savePoster, Movie.new);
    router.get(Config.URL_PREFIX + '/admin/movie/list', User.signInRequired, User.adminRequired, Movie.list);
    router.delete(Config.URL_PREFIX + '/admin/movie', User.signInRequired, User.adminRequired, Movie.del);

};