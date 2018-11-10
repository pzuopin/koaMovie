const Koa = require('koa');
const KoaRouter = require('koa-router');
const Config = require('./config');
const { InitSchemas, Connect } = require('./app/database/init');

(async ()=>{
    await Connect(Config.MONGODB);
    
    InitSchemas();

    const App = new Koa();
    const Router = new KoaRouter();

    require('./config/routes')(Router);
    App.use(Router.routes()).use(Router.allowedMethods());
    
    App.listen(Config.PORT, ()=>{
        console.log(`Server running at http://0.0.0.0:${Config.PORT}`);
    });
})();
