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

const URL_PREFIX = '/koaMovie';  // /koaMovie

const BASE_URL = 'http://dev.feihu1996.cn/koaMovie';

const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const SESSION_KEY = 'r4*$cUQ4';

module.exports = {
    PORT,
    WECHAT,
    MONGODB,
    URL_PREFIX,
    BASE_URL,
    SALT_WORK_FACTOR,
    MAX_LOGIN_ATTEMPTS,
    LOCK_TIME,
    SESSION_KEY,
};
