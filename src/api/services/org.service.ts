import OrganizationModel from "../models/organization.model";
import FileModel from "../models/file.model";

class OrgService {

    private static _singleton: boolean = true;
    private static _instance: OrgService;

    constructer() {

        if (OrgService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use OrgService.instance instead!");
        }

    }

    public static get instance(): OrgService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new OrgService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async createNew(data: any):Promise<any> {
        
        try {
            let logoId: String = "";
            let response: any;
            if (data.logo) {
                const fileRes =  await FileModel.create({url: data.logo, createdBy: data.user});
                logoId = fileRes._id;
                response = await OrganizationModel.create({name: data.name, logo: logoId});
            } else {
                response = await OrganizationModel.create({name: data.name});
            }
           
                
                console.log("response" + response);
                return response;
           /* if(data.logo) {
               
            } else {
                return {
                    error: true,
                    message: "No logo found"
                }
            }*/
            
        }catch (e) {
            console.log(e);
            return {
                error: true,
                message: e.message
            }
        }
    }

    public  async getOrg():Promise<any> {
        try {
            const response = await OrganizationModel.findOne({},{}, {sort: { 'created_at': -1}}).populate({path: "logo", model: FileModel});
            return response;
        } catch(e) {
            return {
                error: true,
                message: e.message
            }
        }
    }
}

export default OrgService;