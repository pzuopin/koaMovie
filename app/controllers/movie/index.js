const Mongoose = require('mongoose');
const _ = require('lodash');
const {URL_PREFIX} = require('../../../config');
let { readFile, writeFile } = require('fs');
let { resolve } = require('path');
const Util = require('util');
const Api = require('./../../api');

const readFileAsync = Util.promisify(readFile);
const writeFileAsync = Util.promisify(writeFile);

const Movie = Mongoose.model('Movie');
const Category = Mongoose.model('Category');
const Comment = Mongoose.model('Comment');

exports.show = async (context, next)=>{
    let {_id} = context.params;
    let movie = {};
    let categories = await Api.movie.searchCategories();
    if(_id){
        movie = await Api.movie.searchMovieById(_id);
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
        category = await Api.movie.searchCategoryById(categoryId);
    }else if(categoryName){
        category = new Category({name: categoryName});
        await category.save();
    }    
    
    if(movieData._id){
       movie = await Api.movie.searchMovieById(movieData._id);
    }
    if(movie){
        movie = _.extend(movie, movieData);
    }else{
        delete movieData._id;
        movieData.category = category._id;
        movie = new Movie(movieData);
    }

    category = await Api.movie.searchCategoryById(category._id);
    if(category){
        category.movies = category.movies || [];
        category.movies.push(movie._id);
        
        await category.save();
    }
    
    await movie.save();
    
    context.redirect(URL_PREFIX + '/admin/movie/list');
};

exports.list = async (context, next)=>{
    let movies = await Api.movie.searchMovies('name');
    await context.render('pages/movie/movie_list', {
        title: '后台电影列表页面',
        movies,
        URL_PREFIX,        
    });
};

exports.del = async (context, next)=>{
    let _id = context.query.id;
    const Cat = await Category.findOne({
        movies: {
            $in: [_id],
        },
    });
    if(Cat && Cat.movies.length){
        const Index = Cat.movies.indexOf(_id);
        Cat.movies.splice(Index, 1);
        await Cat.save();
    }
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

exports.detail = async (context, next)=>{
    let _id = context.params._id;
    let movie = await Api.movie.searchMovieById(_id);
    let comments = await Comment.find({
        movie: _id,
    });
    if(comments){
        comments = await Comment.find({
            movie: _id,
        })
        .populate('from', '_id nickname')
        .populate('replies.from replies.to', '_id nickname');
    }
    await Movie.updateOne({_id}, {$inc: {pv:1}});
    await context.render("pages/movie/movie_detail", {
        title: '电影详情页面',
        movie,
        URL_PREFIX,
        comments,
    });
};

exports.search = async (context, next)=>{
    let {catId, q, p} = context.query;
    
    const Page = parseInt(p, 10) || 0;
    const PageSize = 2;
    const Offset = Page * PageSize;

    if(catId){
        const Categories = await Api.movie.searchCategoriesById(catId);
        const Cat = Categories[0];
        let movies = Cat.movies || [];
        let results = movies.slice(Offset, Offset + PageSize);
        await context.render("pages/movie/movie_search", {
            URL_PREFIX,
            title: "电影分类搜索结果页面",
            keyword: Cat.name,
            currentPage: (Page + 1),
            query: 'catId=' + catId,
            totalPage: Math.ceil(movies.length / PageSize),
            movies: results,
        });
    }else {
        let movies = await Api.movie.searchMoviesByKeyword(q);
        let results = movies.slice(Offset, Offset + PageSize);
        await context.render("pages/movie/movie_search", {
            URL_PREFIX,
            title: "电影关键词搜索结果页面",
            keyword: q,
            currentPage: (Page + 1),
            query: 'q=' + q,
            totalPage: Math.ceil(movies.length / PageSize),
            movies: results,
        });        
    }
};