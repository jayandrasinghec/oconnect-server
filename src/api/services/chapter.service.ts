import ChapterModel from "models/chapter.model";
import ArrayUtils from "../../utils/arrayutils";
import MongoUtils from "../../utils/mongoutils";
import RoleService from "../services/role.service";

class ChapterService {

    private static _singleton: boolean = true;
    private static _instance: ChapterService;

    constructor() {

        if (ChapterService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use OrgService.instance instead!");
        }

    }

    public static get instance(): ChapterService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new ChapterService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async createNew(data):Promise<any> {
        const parent = data.parent;
       // const newRole: any = (data.role) ? await this._createRoleFromChapter(data.role) : null;
       console.log(data.role);
       /* if (!data.role){
            return {
                error: true,
                message: "role not found in body."
            }
       } else {
           const newRole = await this._createRoleFromChapter(data.role);
           data.role = newRole._id;
       } */
        // console.log()
        if (parent) {
            const parentInDB: any = await ChapterModel.findById(parent);
          
            if( parentInDB ) {
                try {
                    data.weightage = parentInDB.weightage + 1;
                    const thisChapter: any = await ChapterModel.create(data);
                    console.log("thisChapter._id", thisChapter._id);
                    ArrayUtils.pushIfNotExists(parentInDB.children, MongoUtils.toObjectIds(thisChapter._id));
                    // parentInDB.chindren.push(thisChapter._id);
                    await parentInDB.save();
                    return thisChapter;
                } catch (e) {
                    return e;
                }
                
            } else {
                return {
                    error: true,
                    message: "Parent chapter not found."
                }
            }
            
        } else {
            console.log("no parent")
            try {
                data.weightage = 0;
                const thisChapter: any = await ChapterModel.create(data);
                return thisChapter;
            } catch (e) {
                console.log("in error ",e);
            }
           
           
           
        }
    }

    private async _createRoleFromChapter(roleName: string):Promise<any> {
       const role: any = await  RoleService.instance.createNew(roleName);
       return role;
    }
    

    public async getChapters(organization, chapterId):Promise<any> {
        const search: any = {organization};
        if(chapterId) {
            search["_id"] = chapterId;
        }
        try {
            const chapters: any = await ChapterModel.find(search)
                                                    .populate({model: ChapterModel, path: "children"})
                                                    .lean()
                                                    .exec();
            if( chapters ) {
                return {
                    error: false,
                    body: chapters
                }
                
            } else {
                return {
                    error: true,
                    message: "Parent chapter not found."
                }
            }
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
        
        
        
    }

    public async getChaptersByWeightage(organization, weightage):Promise<any>{
        const search : any = {organization, weightage};
        try {
            const chapters: any = await ChapterModel.find(search)
                                                    .lean()
                                                    .exec();
            return chapters;

        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
       
    }

    public async getOrganizationChapters(organization):Promise<any>{
        const search: any = {organization};
        try {
            const chapters: any = await ChapterModel.find(search)
                                                    .lean()
                                                    .exec();
            return chapters;

        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
       
    }
    
    public async getChapterById(chapterId: String): Promise<any> {
        try {
            const roleFromChapter: any = await ChapterModel.findById(chapterId)
                                                                    .lean()
                                                                    .exec();
            return roleFromChapter;
        } catch(e) {
            return {
                error: true,
                message: e.message
            }
        }
    }

    public async getRoleFromChapter(chapterId: String): Promise<any> {
        try {
            const roleFromChapter: any = await ChapterModel.findById(chapterId)
                                                                    .select("role")
                                                                    .lean()
                                                                    .exec();
            return roleFromChapter;
        } catch(e) {
            return {
                error: true,
                message: e.message
            }
        }
    }
    
    public async addMembersToChapter(chapterId: string, memberId: string): Promise<any> {
        try {
            const chapterData: any = await ChapterModel.findById(chapterId);
            if (chapterData._id) {
                chapterData.members.push(memberId);
                await chapterData.save();
                return chapterData;
            } else {
                return {
                    error: true,
                    message: "Chapter not found"
                }
            }
            
        } catch(e) {
            return {
                error: true,
                message: e.message
            }
        }
    }
}

export default ChapterService;