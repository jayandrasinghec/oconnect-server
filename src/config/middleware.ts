import loggerMiddleware from '../api/middlewares/logger';
import { ApiAuthMiddleware } from "../api/middlewares/apiauth.middleware";
import HeaderMidleware from "../api/middlewares/header.middleware";
class Middleware {

    public static routes(app: any): void {
        app.all("*",  loggerMiddleware);
      //  app.use("*", HeaderMidleware.crossDomain);
     //  app.use("/api/*", ApiAuthMiddleware.authenticateUserToken);
      // app.use("/auth/logout", Validate.authenticateUser);
    }
}

export default Middleware;