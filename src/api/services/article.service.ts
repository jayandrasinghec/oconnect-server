import ArticleModel from "models/article.model";

class ArticleService {
    private static _singleton: boolean = true;
    private static _instance: ArticleService;

    constructor() {

        if (ArticleService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use ArticleService.instance instead!");
        }

    }

    public static get instance(): ArticleService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new ArticleService();
            this._singleton = true;
        }
        return this._instance;
    }
    
    public async addArticle(data: any):Promise<any> {
        try {
            return await ArticleModel.create({
                title: data.title, 
                description: data.description,
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
    public async getArticles():Promise<any> {
        try {
            return await ArticleModel.find({}).lean();
            
        }catch (e) {
            console.log(e);
            return {
                error: true,
                message: e.message
            }
        }
    }    
}
export default ArticleService;