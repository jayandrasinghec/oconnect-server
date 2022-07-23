import { Request, Response, NextFunction } from "express";
import AuthService from 'services/auth.service';
import UserService from '../services/user.service';

export class AuthController {

    public static auth = async(req: Request, res: Response, next: NextFunction) =>{
        try {
            res.status(200).send('Welcome to OConnect Main');
          } catch (err) {
            next(err);
          }
    }
    



    public static async login(req, res, next): Promise<any> {
        const body: any = req.body;
        const username: string = body.username;
        const password: string = body.password;
        const response: any =  await AuthService.login(username, password);
        
        if (response.error) {
            res.status(501).send(response);
        } else {
            console.log(JSON.stringify(req.session) + "before")
            req.session.user = response;
           // console.log("req.session", req.session);
           // await req.session.save();
            console.log(JSON.stringify(req.session) + "after");

            res.status(200).send(response);
        }
        
    }
    
    public static async token(req: Request, res: Response, next: NextFunction): Promise<any> {
        const body: any = req.body;
        const response: any = await AuthService.validateToken(body.token);
        if (response.error) {
            return res.status(200).send(response.message);
        } else {
            return res.status(200).send(response.body);
        }
    }

    public static async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
        
        const response: any =  await AuthService.logout(req.session.user.token);
        delete req.session.user;
        try {
            return res.status(200).send(response.body);
        } catch (err) {
            next(err);
        }
    }
    public static async validateUsername(req: Request, res: Response, next: NextFunction): Promise<any> {
        const username: any = req.params.username;
        const response: any =  await UserService.validateUsername(username);
        try {
            return res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    }

    public static async signup(req: Request, res: Response): Promise<any> {
        const response: any = await AuthService.signup(req.body.data);
        if(response && req.body.selfsignup){
            const mailResponse: any = await AuthService.selfSignup(req.body.data);
        }
        if(response.error) {
           return res.status(501).json(response);
        } else {
            return res.status(200).json(response);
        }
    }
    
    public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
        const response: any =  await UserService.resetPassword(req.body);
        try {
            return res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    }
}