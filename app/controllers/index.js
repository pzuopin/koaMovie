const {URL_PREFIX} = require('../../config');

exports.homePage = async (context, next) => {
    await context.render('pages/index', {
        title: "首页",
        URL_PREFIX,
    });
};