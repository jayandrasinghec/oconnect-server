import UserModel from "models/user.model";
import RoleModel from "models/role.model";
import UserProfileModel from "models/userprofile.model";
import MemberModel from "models/member.model";
import MongoUtils from "../../utils/mongoutils";
import ChapterService from "./chapter.service";
import MemberService from "./member.service";
import FileModel from "../models/file.model";
import ChapterModel from "../models/chapter.model";
class UserService {

    private static _singleton: boolean = true;
    private static _instance: UserService;

    constructor() {
        if (UserService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use UserService.instance instead!");
        }
    }

    public static get instance(): UserService{
        if (!this._instance) {
            this._singleton = false;
            this._instance = new UserService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async addUser(data: any):Promise<any> {
        console.log("in add user", data);
        try {
            const memberRole: any = await RoleModel.findOne({machine_name: "member"})
                                                    .lean()
                                                    .exec();
            const chapterRole: any = await ChapterService.instance.getRoleFromChapter(data.chapter);
            const newUser: any = await UserModel.create(data);
            const newMember: any = await MemberService.instance.addMember({
                user: newUser._id,
                chapter: data.chapter,
                isCoordinator: data.isCoordinator
            });
            newUser.roles.push(memberRole._id);
            newUser.roles.push(chapterRole.role);
            newUser.members.push(newMember);
            await newUser.save();
            return newUser;
        } catch(e) {
            console.log(e);
            return {error: true, message: e.message};
        }
    }

    public async getUsersById (userId: string): Promise<any> {
        let user;
        try {
            user = await UserModel.findOne({_id: userId})
                    .populate({model: RoleModel, path: "roles"})
                    .populate({model: UserProfileModel, path: "profile", populate: { path: 'photo' , model: FileModel}})
                    .populate({model: MemberModel, path: "members"});
        } catch (e) {
            return {error: true, message: "Invalid User"};
        }
        return user;
        
    }

    public async getUsers (): Promise<any> {
        let user;
        try {
            user = await UserModel.find({username: { $ne: "admin" }})
                    .populate({model: RoleModel, path: "roles"})
                    .populate({model: UserProfileModel, path: "profile", populate: { path: 'photo' , model: FileModel}})
                    .populate({model: MemberModel, path: "members", populate: { path: 'chapter' , model: ChapterModel}});
        } catch (e) {
            return {error: true, message: "Invalid User"};
        }
        return user;
        
    }

    public async fetchUserByToken (token: string | string[]): Promise<any> {
        let user;
        try {
            user = await UserModel.findOne({token: token}).populate({model: RoleModel, path: "roles"})
        } catch (e) {
            return {error: true, message: "Invalid User"};
        }
        return user;
        
    }

    public async validateUsername (username: string | string[]): Promise<any> {
        try {
            const user = await UserModel.findOne({username: username})
            if(user) {
                return {error: true, message: "Username already taken"};
            }
        } catch (e) {
           
        }
        return {error: false, message: "Username is available"};   
    }
    
    public async addProfile(userId: String, profile: any): Promise<any> {
        try {
            console.log("profile", profile);
            profile.user = userId;
            if(profile.photo && profile.photo != ""){
                const fileRes =  await FileModel.create({url: profile.photo, createdBy: profile.user});
                profile.photo = fileRes._id;
            }
            const newProfile: any = await MongoUtils.findOrCreate(UserProfileModel, {user: userId}, profile);
            if ( newProfile && newProfile._id) {
                const updateUserProfile: any = await UserProfileModel.findByIdAndUpdate(newProfile._id, profile)
                const updateUser: any = await UserModel.findByIdAndUpdate(userId, {profile: newProfile._id})
               const findUser: any = await UserModel.findById(userId)
                                                    .populate({model: RoleModel, path:"roles"})
                                                    .populate({model: UserProfileModel, path: "profile", populate: { path: 'photo' , model: FileModel}})
                                                    .populate({model: MemberModel, path: "members"})
                                                    .lean()
                                                    .exec();
                return findUser;
                
            } else {
                return {error: true, message:newProfile};
            }
        } catch (e) {
            return {error: true, message: e.message};
        }
    }
    
    public async updateActiveStatus(data : any):Promise<any> {
        console.log('updateActiveStatus', data)
        const updateObject: any = {
            active: data.active
        };
        try {

            const updateActive: any = await UserModel.findByIdAndUpdate(data.id, updateObject, { 'new': true});
            console.log("updateActive", updateActive);
            return updateActive;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }  

    
    public async resetPassword(data : any):Promise<any> {
        const updateObject: any = {
            password: data.password,
            resetpassword : data.resetpassword
        };
        try {
            const resetPassword: any = await UserModel.findOneAndUpdate({_id: data.id}, updateObject, { 'new': true});
            //await resetPassword.update();
            return resetPassword;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }
}

export default UserService.instance;