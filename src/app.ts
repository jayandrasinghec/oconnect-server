import express, {Router} from 'express';
import session, { MemoryStore } from 'express-session';
import bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import AppRouter from 'config/routes';
import helmet from 'helmet';
import Bootstrap from 'config/bootstrap';
import Responses from './api/responses/index';
import RouterConfig from 'config/routes';
import Validate from 'middlewares/validate';
import Middleware from './config/middleware';
import Secret from 'config/secret';

class App {

    public app: express.Application;
    protected router: AppRouter;
    protected port
    constructor() {
        this.app = express(); //run the express instance and store in app
        this.port = process.env.PORT;
        this.config(this.app);
        this.setMongoConfig();

    }

    private config(app): void {


       /* app.use(session({
            secret: Secret.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false, maxAge:  60000 * 60 * 24 }
          }))*/
         
          const hour = 3600000;
          app.use(session({
           store: new MemoryStore(),
            secret: Secret.SESSION_SECRET,
            resave: true,
            cookie: {expires: new Date(Date.now() + (hour * 24)), sameSite: 'none', domain: 'http://localhost:4200', httpOnly: true}
          }))
        Responses.init()
        // middlewares
        app.use(helmet())
        // support application/json type post data
        app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        app.use(cookieParser());
        //Enables cors   
        app.use(cors());

        this.configRoutes(app);
        // error handling
        this.initErrorHandling(app);
    }

    //Connecting to our MongoDB database
    private setMongoConfig() {
        mongoose.Promise = global.Promise;
        const MONGO_DB: string = process.env.MONGO_URL
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', true);
        const db: any = mongoose.connect(MONGO_DB, { useNewUrlParser: true });
        const mongo = mongoose.connection
        mongo.once("connected", async () => {
            console.log(`Connected to database at ${MONGO_DB}`);
            const response = await Bootstrap.init();
            this.listen();
        });
        mongo.on('disconnected', () => { console.log('mongo: Disconnected') })
    }

    
    private configRoutes (app: express.Application){
        Middleware.routes(app);
        RouterConfig.routes(app);
    }
    private initErrorHandling (app: express.Application){
        const isProduction = (process.env.NODE_ENV === 'production');

        isProduction ? app.set('env', 'production') : app.set('env', 'development');
        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            let err: any = new Error('Not A Valid url');
            err.status = 404;
            next(err);
        });
        if (app.get('env') === 'development') {
            app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.json({
                    message: err.message,
                    error: err
                });
            });
        }
        
        app.use(function(err: any, req: express.Request, res: express.Response, next: Function) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: {}
            });
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }

}

const server: App = new App();