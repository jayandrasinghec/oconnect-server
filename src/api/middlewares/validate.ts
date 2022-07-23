import { Request, Response } from 'express'
import UserService from 'services/user.service';

export default class Validate {
    public static token = async (req: Request, res: Response, next) => {
        console.log("In Middleware >> token");
        const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['authorization'];
        if(token){
            try{
                
                    console.log("calling next");
                    next();
    
                
            }catch(err){
                console.log(err);
                return res["tokenError"](401,err);
            }
        }else{
            return res["tokenError"](401,'no token found');
        }
    }
    public static authenticateUser = async (req: Request, res: Response, next) => {
        const token: string | string[] = req.headers['Authorization'] || req.headers['authorization'] || "";
        // const loggedInUser: any = await UserService.fetchUserByToken(token);
        const loggedInUser: any = req.session['user'];
        if(loggedInUser && loggedInUser.token == token ){
            try{
                    next();                
            }catch(err){
                console.log(err);
                return res["forbidden"](401,err);
            }
        }else{
            return res["forbidden"](401,'forbidden');
        }
    }
}
