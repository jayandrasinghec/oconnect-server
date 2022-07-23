import UtilityScripts from "../../utils/utilityscripts";
import UserService from "../services/user.service";
import EmailService from "./email.service";
import { EmailConstants } from "config/constants";

class AdminService {
    private static _singleton: boolean = true;
    private static _instance: AdminService;

    constructor() {

        if (AdminService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use AdminService.instance instead!");
        }

    }

    public static get instance(): AdminService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new AdminService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async addMember(data: any): Promise<any> {
        const password: string = UtilityScripts.generatePassword();
        data.password = password;
        data.active = 1;
        data.resetpassword = true;
        const fromEmail: String = EmailService.FROM_EMAIL;
        const toEmail: String = data.email;
        const mailDetails: any = {
            from: fromEmail,
            to: toEmail,
            subject: EmailConstants.MEMBER_INVITE_SUBJECT,
            html: `Hello <br/><br/> Greatings from OConnect.<br/><br/> Here is your credentials. <br/>Username: ${toEmail}<br/>Password: ${password}<br/><br/>Thank you.<br/>OConnect Team`
        }
        try {
            const newUser: any = await UserService.addUser(data);
            const emailResponse: any = await EmailService.instance.sendMail(mailDetails);
            
            return {
                user: newUser,
                emailResponse: emailResponse
            }
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }
}

export default AdminService;