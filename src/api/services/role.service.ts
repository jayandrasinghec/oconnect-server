import UtilityScripts from "../../utils/utilityscripts";
import MongoUtils from "../../utils/mongoutils";
import RoleModel from "models/role.model";

class RoleService {
    private static _singleton: boolean = true;
    private static _instance: RoleService;

    constructor() {

        if (RoleService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use RoleService.instance instead!");
        }

    }

    public static get instance(): RoleService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new RoleService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async createNew(role: string):Promise<any> {
        try {
            const findObj: any = {
                machine_name: UtilityScripts.machine_name(role)
            };
            const createObj: any = {
                name: role
            };
            const response: any = await MongoUtils.findOrCreate(RoleModel, findObj, createObj);
            console.log(response);
            return response;
        } catch(e) {

        }
    }
}

export default RoleService;