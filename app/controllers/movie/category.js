const Mongoose = require('mongoose');
const {URL_PREFIX} = require('../../../config');
const Api = require('./../../api');

const Category = Mongoose.model('Category');
const Movie = Mongoose.model('Movie');

exports.show = async (context, next)=>{
    let { _id } = context.params;
    let category = {};
    if(_id){
        category = await Api.movie.searchCategoryById(_id);
    }
    await context.render('pages/movie/category_new', {
        title: "后台电影分类录入页面",
        category,
        URL_PREFIX,
    });
};

exports.new = async (context, next)=>{
    let { name,_id } = context.request.body.category;
    let category;
    if(_id){
        category = await Api.movie.searchCategoryById(_id);
    }
    if(category){
        category.name = name;
    }else{
        category = new Category({
            name,
        });
    }
    category.save();
    context.redirect(URL_PREFIX + '/admin/movie/category/list');
};

exports.list = async (context, next)=>{
    let categories = await Api.movie.searchCategories();
    await context.render('pages/movie/category_list', {
        title: "后台电影分类列表页面",
        categories,
        URL_PREFIX,        
    });
};

exports.del = async (context, next)=>{
    let _id = context.query.id;
    try{
        await Category.deleteOne({_id});
        await Movie.deleteMany({
            category: _id,
        });
        context.body = {
            success: true,
        };
    }catch(error){
        console.log(error);
        context.body = {
            success: false,
        };        
    }
};