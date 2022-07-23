import FAQModel from "models/faq.model";

class FaqService {
    private static _singleton: boolean = true;
    private static _instance: FaqService;

    constructor() {

        if (FaqService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use FaqService.instance instead!");
        }

    }

    public static get instance(): FaqService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new FaqService();
            this._singleton = true;
        }
        return this._instance;
    }
    
    public async addFaq(data: any):Promise<any> {
        try {
            return await FAQModel.create({
                question: data.question, 
                answer: data.answer,
                created_by: data.created_by
            });
            
        }catch (e) {
            console.log(e);
            return {
                error: true,
                message: e.message
            }
        }
    }
    public async getFaq():Promise<any> {
        try {
            return await FAQModel.find({}).lean();
            
        }catch (e) {
            console.log(e);
            return {
                error: true,
                message: e.message
            }
        }
    }    
}
export default FaqService;