import nodemailer from "nodemailer";

class EmailService {

    private static _singleton: boolean = true;
    private static _instance: EmailService;
    private _mailTransporter: any;

    public static readonly FROM_EMAIL: String = "oconnect2020@gmail.com";

    constructer() {
        
        if (EmailService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use EmailService.instance instead!");
        }
        
    }

    public init(): void {
        this._mailTransporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: { 
                user: process.env.GMAIL_AUTH_USER, 
                pass: process.env.GMAIL_AUTH_PASSWORD
            } 
        })
    }

    public static get instance(): EmailService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new EmailService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async sendMail(mailDetails: any): Promise<any> {
        try {
            const response: any = await this._mailTransporter.sendMail(mailDetails);
            console.log(response);
            return response;
        } catch (e) {
            return {
                error: true,
                message : e.message
            }
        }
    }
}

export default EmailService;