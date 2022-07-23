import AdminService from "services/admin.service";

export class AdminController {

    public static async addmember(req, res): Promise<any> {
        const response: any = await AdminService.instance.addMember(req.body);
        console.log(response);
        if (response.error) {
            return res.status(501).send(response);
        } 
        return res.status(200).send(response);
    }
}