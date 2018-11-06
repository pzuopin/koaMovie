const Mongoose = require('mongoose');
const { reslove } = require('path');
const glob = require('glob');

Mongoose.Promise = global.Promise;

exports.Connect = (db)=>{
    return new Promise((reslove)=>{
        Mongoose.connect(db);
        Mongoose.connection.on('disconnect', ()=>{
            console.log("数据库挂了吧，少年");
        });
        Mongoose.connection.on('error', (err)=>{
            console.log(err);
        });
        Mongoose.connection.on('open', ()=>{
            console.log('MongoDB connected');
            reslove();
        });
    });
};

exports.InitSchemas = ()=>{
    glob.sync(reslove(__dirname, './schema', '**/*.js')).forEach(require);
};