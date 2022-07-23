import { Request, Response, NextFunction } from "express";
import UserService from 'services/user.service';

export class UserController {
    /**
     * API user
     * GET /api/user/get
     */
    public static getUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user: any = await UserService.getUsersById(req.params.id)
        console.log(user);
         res.status(200)
         return res.json({ data: user });
      } catch (err) {
        next(err);
      }
    };
  
    /**
     * POST add user's
     * POST /api/user/create
     */
    public static create = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          body: user,
        } = req;
        return res.status(200).json({ data: `Your name is ${user}. Ola!` });
      } catch (err) {
        next(err);
      }
    };

    public static async addProfile(req, res): Promise<any> {
      const profile = req.body;
      const { userid } = req.params;
      const response = await UserService.addProfile(userid, profile);
      if ( response.error ) {
        return res.status(501).send(response);
      } else {
        return res.status(200).json(response);
      }
    }
    
    public static async getUsers(req, res): Promise<any> {
      const response = await UserService.getUsers();
      if ( response.error ) {
        return res.status(501).send(response);
      } else {
        return res.status(200).json(response);
      }
    }
        
    public static async updateActiveStatus(req, res): Promise<any> {
      const response = await UserService.updateActiveStatus(req.body);
      if ( response.error ) {
        return res.status(501).send(response);
      } else {
        return res.status(200).json(response);
      }
    }
  }
  