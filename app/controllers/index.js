const {URL_PREFIX} = require('../../config');
const Mongoose = require('mongoose');

const Category = Mongoose.model('Category');

exports.homePage = async (context, next) => {
    let categories = await Category.find({}).populate({
        path: 'movies',
        select: '_id title poster',
        options: {limit: 8},
    });
    await context.render('pages/index', {
        title: "首页",
        URL_PREFIX,
        categories,
    });
};
