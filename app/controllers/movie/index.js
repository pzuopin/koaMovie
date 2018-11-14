const Mongoose = require('mongoose');
const _ = require('lodash');
const {URL_PREFIX} = require('../../../config');
let { readFile, writeFile } = require('fs');
let { resolve } = require('path');
const Util = require('util');

const readFileAsync = Util.promisify(readFile);
const writeFileAsync = Util.promisify(writeFile);

const Movie = Mongoose.model('Movie');
const Category = Mongoose.model('Category');

exports.show = async (context, next)=>{
    let {_id} = context.params;
    let movie = {};
    let categories = await Category.find({});
    if(_id){
        movie = await Movie.findOne({_id});
    }
    await context.render('pages/movie/movie_new', {
        title: '后台电影录入页面',
        movie,
        URL_PREFIX,
        categories,
    });
};

exports.new = async (context, next)=>{
    let movieData = context.request.body.fields || {};
    let movie;

    let category;
    let categoryId = movieData.categoryId;
    let categoryName = movieData.categoryName;

    if(context.poster){
        movieData.poster = context.poster;
    }
    
    if(categoryId){
        category = Category.findOne({_id:categoryId});
    }else if(categoryName){
        category = new Category({name: categoryName});
        await category.save();
    }    
    
    if(movieData._id){
       movie = Movie.findOne({_id:movieData._id});
    }
    if(movie){
        movie = _.extend(movie, movieData);
    }else{
        delete movieData._id;
        movieData.category = category._id;
        movie = new Movie(movieData);
    }

    category = await Category.findOne({_id: category._id});
    if(category){
        category.movies = category.movies || [];
        category.movies.push(movie._id);
        
        await category.save();
    }
    
    await movie.save();
    
    context.redirect(URL_PREFIX + '/admin/movie/list');
};

exports.list = async (context, next)=>{
    let movies = await Movie.find({}).populate('category', 'name');
    await context.render('pages/movie/movie_list', {
        title: '后台电影列表页面',
        movies,
        URL_PREFIX,        
    });
};

exports.del = async (context, next)=>{
    let _id = context.query.id;
    try{
        await Movie.deleteOne({_id});
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

exports.savePoster = async (context, next)=>{
    const PostData = context.request.body.files.uploadPoster;
    const FilePath = PostData.path;
    const FileName = PostData.name;
    
    if(FileName){
        const Data = await readFileAsync(FilePath);

        const TimeStamp = Date.now();
        const Type = PostData.type.split('/')[1];
        const Poster = TimeStamp + '.' + Type;
        const NewPath = resolve(__dirname, '../../../', 'public/upload/' + Poster);

        await writeFileAsync(NewPath, Data);

        context.poster = Poster;
    }

    await next();
};