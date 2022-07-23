import ChapterService from "../services/chapter.service";

export class ChapterController {

    public static async create(req, res): Promise<any> {

        try {
            const response = await ChapterService.instance.createNew(req.body);
            if( response.error) {
               return res.status(501).send(response);
            } else {
                res.json(response);
            }
        } catch (e) {

        }
    }

    public static async get(req, res):Promise<any> {
        const {organizationId, chapterId} = req.params
        const response = await ChapterService.instance.getChapters(organizationId, chapterId);
        if (!response || response.length == 0) {
            return res.status(404).send("No Results found");
        } else {
            if(response.error) {
                res.status(501).json(response.message);
            } else {
                return res.status(200).json(response);

            }
        }

    }

    public static async getByWeightage(req, res):Promise<any> {
        const {organizationId, weightageId} = req.params;
        const response = await ChapterService.instance.getChaptersByWeightage(organizationId, weightageId);
        if (!response || response.length == 0) {
            return res.status(404).send("No Results found");
        } else {
            if(response.error) {
                res.status(501).json(response.message);
            } else {
                return res.status(200).json(response);

            }
        }
    }
    
    public static async getById(req, res):Promise<any> {
        const {chapterId} = req.params;
        const response = await ChapterService.instance.getChapterById(chapterId);
        if (!response || response.length == 0) {
            return res.status(404).send("No Results found");
        } else {
            if(response.error) {
                res.status(501).json(response.message);
            } else {
                return res.status(200).json(response);

            }
        }
    }

    
    public static async getByOrganization(req, res):Promise<any> {
        const {organizationId} = req.params;
        const response = await ChapterService.instance.getOrganizationChapters(organizationId);
        if (!response || response.length == 0) {
            return res.status(404).send("No Results found");
        } else {
            if(response.error) {
                res.status(501).json(response.message);
            } else {
                return res.status(200).json(response);

            }
        }
    }
}