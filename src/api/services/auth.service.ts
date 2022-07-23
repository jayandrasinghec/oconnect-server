import * as jwt from "jwt-simple";
import bcrypt from "bcrypt";
import Secret from "../../config/secret";
import UserModel from "models/user.model";
import RoleModel from "models/role.model";
import ChapterService from "./chapter.service";
import MemberService from "./member.service";
import { userInfo } from "os";
import MemberModel from "models/member.model";
import UserProfileModel from "models/userprofile.model";
import ChapterModel from "models/chapter.model";
import UserService from "../services/user.service";
import { EmailConstants } from "config/constants";
import EmailService from "./email.service"
import Auth from "../../config/auth";

class AuthService {

    private static _singleton: boolean = true;
    private static _instance: AuthService;

    constructor() {
        if (AuthService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use AuthService.instance instead!");
        }
    }

    public static get instance(): AuthService{
        if (!this._instance) {
            this._singleton = false;
            this._instance = new AuthService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async login(username: string, password: string): Promise<any> {
        let response: any = { error: true, message: "Invalid Username or password" };
        let userData: any = {};
        try {
            userData =  await UserModel.findOne({username})
            .select("email token username password")
            .lean()
            .exec();
            if (userData && userData._id) {  
                const res = await this.checkUser(password, userData.password);
                console.log("res password matched", res)
                if (res) {
                    delete userData.password;
                    const updatedToken: string = this.setupToken(userData);
                    const updatedDataToken: any = await UserModel.findByIdAndUpdate(userData._id, {token: updatedToken, lastLoggedIn: Date.now()})
                    const updatedData: any = await UserModel.findOne({username})
                    .populate({model: RoleModel, path: "roles"})
                    .populate({
                        model: MemberModel, 
                        path: "members",
                        populate: {model: ChapterModel, path: "chapter"}
                    })
                    .populate({model: UserProfileModel, path: "profile"})
                    .lean()
                    .exec();
                    delete updatedData.password;
                    //console.log(updatedData);
                    return updatedData;
                } else {
                    return response;
                }
            } else {
                return response;
            }
        } catch (e) {
            response.message = e.message;
            return response;
        }
        
       // return response;
    }

    public  async logout(token: string): Promise<any> {
        let response: any = { error: true, body: "Invalid Token" };
        let userData: any =  await UserModel.findOne({token})

        if (userData) { 
            const updatedDataToken: any = await UserModel.findByIdAndUpdate(userData._id, {token: ""})
            response = { error: false, body: "Token Deleted Successfully" };
        }
        return response;
    }

public async validateToken(token: any): Promise<any> {
    let response: any = { error: true, body: "Invalid Token" };
    let tokenData: any = "";
    if (token) {
        tokenData = await UserModel.findOne({"token": token}).select("email firstName lastName token").lean().exec();
        if (tokenData) {
            response = { error: false, body: tokenData };
        }
    }
    return response;
}

private  async checkUser(password: string, hashPassword: string): Promise<any> {
    console.log("check User", password, hashPassword)
    const match: boolean = bcrypt.compareSync(password, hashPassword);
    return match;
}

private setupToken(user: any): string {
    const secret: Secret = new Secret();
    const tokenData: any = secret.getToken(user);
    let updatedToken: string = "";
    if (user.token && user.token != "") {
        try {
            const decoded: any = jwt.decode(user.token, secret.tokenKey());
            console.log(decoded, (decoded.exp - Date.now()));
            if (decoded.exp <= Date.now()) {
                updatedToken = tokenData.token;
            } else {
                updatedToken = user.token;
            }
        } catch (e) {
            updatedToken = tokenData.token;
        }
    } else {
        updatedToken = tokenData.token;
    }
    return updatedToken;
}

    public async signup(data: any): Promise<any> {
        try {
            let isActive: Number = 0;
            let isCoordinator: boolean = false;
            console.log(data.memberInvite);
            const memberInviteData: any = await MemberService.instance.getInviteById(data.memberInvite);
            
            if ( memberInviteData ) {
                isActive = 1;
                isCoordinator = memberInviteData.isCoordinator
            }
            data.active = isActive;
            data.isCoordinator = isCoordinator;
            const newUser: any = await UserService.addUser(data);
            return newUser;

        } catch (e) {
            console.log(e);
            return {
                error: true,
                message: e.message
            }
        }
        
    }

    
    public async selfSignup(data : any): Promise<any> {
        const users: Array<any> = Auth.users;
        const toEmail: String = users[0].email;
        const fromEmail: String = EmailService.FROM_EMAIL;
            const mailDetails: any = {
                from: fromEmail,
                to: toEmail,
                subject: EmailConstants.USER_ADD_SUBJECT,
                html: `Hello <br/><br/> Greatings from OConnect.<br/><br/> New User ${data.full_Name} is been added to the system.`
            }
            try {
                const emailResponse: any = await EmailService.instance.sendMail(mailDetails)
                return emailResponse;
            } catch (e) {
                return {
                    error: true,
                    message: e.message
                }
            }
 
        } 
        
    
}

export default AuthService.instance;