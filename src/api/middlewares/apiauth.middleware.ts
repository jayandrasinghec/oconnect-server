export class ApiAuthMiddleware {

    public static authenticateUserToken(req: any, res: any, next: Function): any {
        const authorizaton: string = req.headers.Authorization || req.headers.authorization;
       console.log(req.session.user);
        console.log("req.session.user", req.session);
        const sessionUser: any = req.session.user;
       
        if (!authorizaton || (authorizaton == '')) {
            return res.status(400).send('Bad Request!! - Authorization not found in header');
        } else {
            if (sessionUser && sessionUser.token && (authorizaton == sessionUser.token)) {
                next();
            } else {
                console.log(authorizaton + ':' + sessionUser.token);
                res.header("WWW-Authenticate", "Login to access the API");
                res.sendStatus(401);
            }
        }
    }
}