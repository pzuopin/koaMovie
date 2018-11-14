const Koa = require('koa');
const KoaRouter = require('koa-router');
const BodyParser = require('koa-bodyparser');
const Session = require('koa-session');
const Moment = require('moment');
const Path = require('path');
const Config = require('./config');
const { InitSchemas, Connect } = require('./app/database/init');
const Views = require('koa-views');
const Mongoose = require('mongoose');
const Serve = require('koa-static-server');

(async ()=>{
    await Connect(Config.MONGODB);
    
    InitSchemas();

    const App = new Koa();
    const Router = new KoaRouter();

    App.use(Views(Path.resolve(__dirname + '/app/views'), {
        extension: 'pug',
        options: {
            moment: Moment,
        },
    }));

    App.keys = [Config.SESSION_KEY];
    App.use(Session(App));
    App.use(BodyParser());
    App.use(Serve({
      rootDir: Path.resolve(__dirname, 'public'),
      rootPath: Config.URL_PREFIX + '/static',
    }));

    App.use(async (context, next) => {
        const UserModel = Mongoose.model('User');
        let user = context.session.user;
        if (user && user._id) {
          user = await UserModel.findOne({ _id: user._id });
          if (user) {
            context.session.user = {
              _id: user._id,
              nickname: user.nickname,
              role: user.role,
            };
            context.state = Object.assign(context.state, {
              user: {
                _id: user._id,
                nickname: user.nickname,
              },
            });
          }
        } else {
          context.session.user = null;
        }
        await next();
    });

    require('./config/routes')(Router);
    App.use(Router.routes()).use(Router.allowedMethods());
    
    App.listen(Config.PORT, ()=>{
        console.log(`Server running at http://0.0.0.0:${Config.PORT}`);
    });
})();
