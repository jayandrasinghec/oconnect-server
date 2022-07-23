import FaqService from "services/faq.service";

export class FaqController {
    public static async add(req, res): Promise<any> {
        const response: any = await FaqService.instance.addFaq(req.body);
        if (response.error) {
            return res.status(501).send(response);
        } 
        return res.status(200).send(response);
    }

    public static async get(req, res): Promise<any> {
        const response: any = await FaqService.instance.getFaq();
        if (response.error) {
            return res.status(500).send(response);
        } 
        return res.status(200).send(response);
    }        
}