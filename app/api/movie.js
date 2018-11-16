const Mongoose = require('mongoose');
const Request = require('request-promise');
const _ = require('lodash');

const Category = Mongoose.model('Category');
const Movie = Mongoose.model('Movie');

const UpdateMovies = async (movie)=>{
    const Options = {
        uri: `https://api.douban.com/v2/movie/subject/${movie.doubanId}`,
        json: true,
    };
    const Data = await Request(Options);
    _.extend(movie, {
        country: Data.countries[0],
        language: Data.language,
        summary: Data.summary,
    });    
    const Genres = movie.genres;
    if (Genres && Genres.length) {
        await Promise.all(Genres.map(async genre => {
          let cat = await Category.findOne({
            name: genre,
          });
          if (cat) {
            cat.movies.push(movie._id);
            await cat.save();
          } else {
            cat = new Category({
              name: genre,
              movies: [movie._id],
            });
            cat = await cat.save();
            movie.category = cat._id;
            await movie.save();
          }
        }));
      } else {
        movie.save();
      }    
};

exports.searchCategoriesById = async (catId)=>{
    const Data = await Category.find({_id: catId}).populate({
        path: 'movies',
        select: '_id title poster',
    });
    return Data;
};

exports.searchMoviesByKeyword = async (keyword)=>{
    const Data = await Movie.find({
        title: new RegExp(keyword + '.*', 'i'),
    });
    return Data;
};

exports.searchMovieById = async (movieId)=>{
    const Data = await Movie.findOne({
        _id: movieId,
    });
    return Data;
};

exports.searchCategoryById = async (catId)=>{
    const Data = await Category.findOne({
        _id: catId,
    });
    return Data;
};

exports.searchCategories = async ()=>{
    const Data = await Category.find({});
    return Data;
};

exports.searchMovies = async (field)=>{
    const Data = await Movie.find({}).populate('category', field);
    return Data;
};

exports.findHotMovies = async (sort, count)=>{
    const Data = await Movie.find({}).
    sort({
        pv:sort,
    })
    .limit(count);
    return Data;
};

exports.findMoviesByCat = async (name)=>{
    const Data = await Category.findOne({
        name,
    })
    .populate({
        path: 'movies',
        select: "_id title poster summary",
    });
    if(Data){
        Data.movies = Data.movies.slice(0, 8);
        return Data.movies;
    }else{
        return [];
    }
};

exports.searchDoubanMovies = async (keyword)=>{
    const Options = {
        uri: `https://api.douban.com/v2/movie/search?q=${encodeURIComponent(keyword)}`,
        json: true,
    };
    const Data = await Request(Options);
    let subjects = [];
    let movies = [];
    if (Data && Data.subjects) {
        subjects = Data.subjects;
    }    
    if(subjects.length){
        await Promise.all(subjects.map(async item => {
            let movie = await Movie.findOne({
              doubanId: item.id,
            });
            if (movie) {
              movies.push(movie);
            } else {
              const Directors = item.directors || [];
              let director = Directors[0] || {};
              movie = new Movie({
                title: item.title,
                director: director.name,
                doubanId: item.id,
                year: item.year,
                genres: item.genres || [],
                poster: item.images.large,
              });
              movie = await movie.save();
              movies.push(movie);
            }
          }));
          movies.forEach(movie => {
            UpdateMovies(movie);
          });        
    }
    return movies;
};