const Koa = require('koa');
const KoaRouter = require('koa-router');
const BodyParser = require('koa-bodyparser');
const Session = require('koa-session');
const Moment = require('moment');
const Path = require('path');
const Config = require('./config');
const { InitSchemas, Connect } = require('./app/database/init');
const Views = require('koa-views');

(async ()=>{
    await Connect(Config.MONGODB, {useNewUrlParser:true});
    
    InitSchemas();

    const App = new Koa();
    const Router = new KoaRouter();

    App.use(Views(Path.resolve(__dirname + '/app/views'), {
        extension: 'pug',
        options: {
            moment: Moment,
        },
    }));

    App.use(Session(App));
    App.use(BodyParser());

    require('./config/routes')(Router);
    App.use(Router.routes()).use(Router.allowedMethods());
    
    App.listen(Config.PORT, ()=>{
        console.log(`Server running at http://0.0.0.0:${Config.PORT}`);
    });
})();
