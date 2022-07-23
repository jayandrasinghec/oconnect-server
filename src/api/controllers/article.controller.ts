import ArticleService from "services/article.service";

export class ArticleController {
    public static async add(req, res): Promise<any> {
        const response: any = await ArticleService.instance.addArticle(req.body);
        if (response.error) {
            return res.status(501).send(response);
        } 
        return res.status(200).send(response);
    }

    public static async get(req, res): Promise<any> {
        const response: any = await ArticleService.instance.getArticles();
        if (response.error) {
            return res.status(500).send(response);
        } 
        return res.status(200).send(response);
    }        
}