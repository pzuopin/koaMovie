const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const {URL_PREFIX} = require('../../config');

exports.showSignUp = async (context, next)=>{
    await context.render('pages/signUp', {
        title: '注册页面',
        URL_PREFIX,
    });
};

exports.showSignIn = async (context, next)=>{
    await context.render('pages/signIn', {
        title: '登录页面',
        URL_PREFIX,
    });
};

exports.signUp = async (context, next)=>{
    let {
        email,
        password,
        nickname,
    } = context.request.body.user;
    let user = await User.findOne({
        email: email,
    });
    if(user){
        return context.redirect(URL_PREFIX + '/user/signIn');
    }
    user = new User({
        email: email,
        nickname: nickname,
        password: password,
    });
    context.session.user = {
        _id: user._id,
        nickname: user.nickname,
    };
    await user.save();
    context.redirect(URL_PREFIX + '/');
};

exports.signIn = async (context, next) => {
    let {
        email,
        password,
    } = context.request.body.user;
    let user = await User.findOne({
        email: email,
    });
    if(!user){
        return context.redirect(URL_PREFIX + '/user/signUp');
    }
    let isMatch = await user.checkPassword(password, user.password);
    if(isMatch){
        context.session.user = {
            _id: user._id,
            nickname: user.nickname,
        };
        return context.redirect(URL_PREFIX + '/');
    }
    return context.redirect(URL_PREFIX + '/user/signIn');
};

exports.logOut = async (context, next)=>{
    context.session.user = null;
    return context.redirect(URL_PREFIX + '/');
};