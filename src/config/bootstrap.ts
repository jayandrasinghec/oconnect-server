import RoleModel from "models/role.model";
import UserModel from "models/user.model";
import UtilityScripts from "../utils/utilityscripts";
import MongoUtils from "../utils/mongoutils";
import ArrayUtils from "../utils/arrayutils";
import Auth from "./auth";
import MailService from "../api/services/email.service";

export default class Bootstrap {
    public static async init() {
        MailService.instance.init();
        const addedRoles = await this.addRoles();
        const addedUsers = await this.addUsers();
        return "App is initiated!!";
    }

    private static async addRoles(): Promise<any> {
        const roles: Array<string> = Auth.roles;
        const promises = await roles.map(async(role) => {
            const response =  await this.addRole(role);
            return response;
        });
        const responses = await Promise.all(promises);
        return responses;
    }

    private static async addRole(name: string): Promise<any> {
        const findObj: any = {
            machine_name: UtilityScripts.machine_name(name)
        };
        const createObj: any = {
            name: name
        };
        const response: any = await MongoUtils.findOrCreate(RoleModel, findObj, createObj);
        return response;
    }

    private static async addUsers(): Promise<any> {
        const users: Array<any> = Auth.users;
        const promises = await users.map(async(user) => {
            const response = await this.addUser(user);
            return response;
        });
        const responses = await Promise.all(promises);
        return responses;
    }

    private static async addUser(user: any): Promise<any> {
        user.roles = await MongoUtils.arrayToCollection(RoleModel, user.roles);

        const findObj: any = {
            mobile: user.mobile
        };
        const newUser = await MongoUtils.findOrCreate(UserModel, findObj, user);
        const roleswithuser: any = this.addUserInRoles(user.roles, newUser);
        return newUser;
    }

    private static async addUserInRoles(roles: Array<any>, user: any): Promise<any> {
        const promises = await roles.map(async (roleid) => {
            const role: any =  await RoleModel.findById(roleid);
            ArrayUtils.pushIfNotExists(role.users, MongoUtils.toObjectIds(user._id));
            await role.save();
            return role;
        });
        const responses = Promise.all(promises);
        return responses;
    }

    
}