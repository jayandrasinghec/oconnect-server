import OrgService from "../services/org.service";

export class Organization {

    public static async createNew(req, res):Promise<any> {

        try {
            const response = await OrgService.instance.createNew(req.body);
            console.log(response);
            if( response.error) {
               return res.status(501).send(response.error);
            } else {
                res.json(response);
            }
        } catch (e) {

        }
    }

    public static async getOne(req, res):Promise<any> {
        const response = await OrgService.instance.getOrg();
        if (!response) {
            return res.status(404).send("Not Found")
        } else {
            if(response.error) {
                res.status(501).json(response.error);
            } else {
                return res.status(200).json(response);

            }
        }

    }
}

