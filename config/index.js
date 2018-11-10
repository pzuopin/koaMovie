const PORT = 8091;

const WECHAT = {
    AppID: 'wxd0773ac8ecb445b9',
    AppSecret: 'c42e33b100b2a9905cba9d6b1eafc109',
    Token: '70pJmQ6EfGkNYc9YhXzCi8l8j42K72eE',
};

const MONGO_HOST = '127.0.0.1';
const MONGO_PORT = 27017;
const MONGO_DB = 'koaMovie';
const MONGODB = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const URL_PREFIX = '/koaMovie';  // /koaMovie

const BASE_URL = 'http://dev.feihu1996.cn/koaMovie';

module.exports = {
    PORT,
    WECHAT,
    MONGODB,
    URL_PREFIX,
    BASE_URL,
};
