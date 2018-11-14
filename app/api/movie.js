const Mongoose = require('mongoose');

const Category = Mongoose.model('Category');
const Movie = Mongoose.model('Movie');

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