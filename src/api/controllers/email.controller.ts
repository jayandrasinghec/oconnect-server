import EmailService from "services/email.service";

export class EmailController {
   
        public static async sendMail(req, res): Promise<any>{
            const response = await EmailService.instance.sendMail(req.body);
            return res.json(response);
        }
}