const PORT = 8091;
const WECHAT = {
    AppID: 'wx3662cd7b42e9a72e',
    AppSecret: '51285fa6c5d518e4cd3887a3164fcb59',
    Token: '70pJmQ6EfGkNYc9YhXzCi8l8j42K72eE',    
};
const MONGO_HOST = '127.0.0.1';
const MONGO_PORT = 27017;
const MONGO_DB = 'koaMovie';
const MONGODB = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

module.exports = {
    PORT,
    WECHAT,
    MONGODB,
};
