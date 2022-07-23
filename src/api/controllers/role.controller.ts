import RoleService from "../services/role.service";

export class RoleController {

    public static async create(req:any, res:any): Promise<any>{
        console.log("i am in create",req.body)
        try {
            const response: any = await RoleService.instance.createNew(req.body.name);
            console.log("res", response);
            if(response.error) {
                res.status(501).json(response);

            } else {
                res.status(200).json(response);
            }
        } catch (e) {
            res.status(501).json(e.message);
        }
    }
}