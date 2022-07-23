import EmailService from "./email.service";
import Settings from "config/settings";
import MemberInviteModel from "models/memberinvite.model";
import { EmailConstants } from "config/constants";
import MemberModel from "models/member.model";
import ChapterService from "./chapter.service";

class MemberService {

    private static _singleton: boolean = true;
    private static _instance: MemberService;

    private readonly INVITE_URL: String = "/signup/invite";

    constructer() {

        if (MemberService._singleton) {
            throw new SyntaxError("This is a singleton class. Please use MemberService.instance instead!");
        }

    }

    public static get instance(): MemberService {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new MemberService();
            this._singleton = true;
        }
        return this._instance;
    }

    public async sendInvite(data: any): Promise<any> {
        const toEmail: String = data.email;
        const fromEmail: String = EmailService.FROM_EMAIL;
        const newInvite: any = await this._createMemberInviteRecord(data);
        if ( newInvite && !newInvite.error ) {
            console.log("newInvite", newInvite);
            const fullInviteURl = `${Settings.WEBCLIENT_HOST_URL}${this.INVITE_URL}/${newInvite._id}`;
            console.log(fullInviteURl);
            const mailDetails: any = {
                from: fromEmail,
                to: toEmail,
                subject: EmailConstants.MEMBER_INVITE_SUBJECT,
                html: `Hello <br/><br/> Greatings from OConnect.<br/><br/> <a href = '${fullInviteURl}'>Click Here</a> to accept the invitation and signup.`
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
 
        } else {
            return newInvite;
        }
        
    }

    private async _createMemberInviteRecord(data: any): Promise<any> {
        try {
            const newInvite: any = await MemberInviteModel.create(data);
            if (newInvite && newInvite._id) {
                return newInvite;
            } else {
                return {
                    error: true,
                    message: newInvite
                }
            }
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }

    public async updateInviteStatus(inviteId: String, status: Number):Promise<any> {
        const textStatus: String = this._getStatusText(status);
        console.log("textStatus", textStatus);
        const updateObject: any = {
            status: textStatus
        };
        try {

            const updateInvite: any = await MemberInviteModel.findByIdAndUpdate(inviteId, updateObject, { 'new': true});
            console.log("updateInvite", updateInvite);
            return updateInvite;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }

    private _getStatusText(statusId: Number): String {
        console.log('statusId', statusId);
        switch (statusId) {
            case 0:
                return "pending";
            break;
            case 1:
                console.log("accepted")
                return "accepted";
            break;
            case 2:
                return "rejected";
            break;
            case 3:
                return "expired";
            break;
            default:
                console.log("default")
                return "pending";
        }
    }
    public async getInviteById(id: String): Promise<any> {
        try {
            const memberInvite: any = await MemberInviteModel.findById(id)
                                                        .lean()
                                                        .exec();
            return memberInvite;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }

    
    public async getInviteByIdAndStatus(id: string, inviteStatus : Number): Promise<any> {
        try {
            console.log('inviteStatus', inviteStatus)
            const status: String = this._getStatusText(inviteStatus);
            const search = {id, status}
            const memberInvite: any = await MemberInviteModel.find({'_id': id, "status" : status})
                                                        .lean()
                                                        .exec();
            return memberInvite;
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }

    public async addMember(data: any): Promise<any> {
        try {
            const newMember: any = await MemberModel.create(data);
            const chapter: any = await ChapterService.instance.addMembersToChapter(newMember.chapter, newMember._id);
            if (chapter.error) {
                return chapter;
            } else {
                return newMember;
            }
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }

    public async getMemberInvites(user: String, status: Number = undefined): Promise <any> {
        try {
            let find: any = {createdby: user};
            if(status) {

                find.status = status;
            }
            const invites: any = MemberInviteModel.find().lean().exec();
            return invites;

        } catch(e) {
            return {
                error: true,
                message: e.message
            }
        }
    }

    public async getCount(chapter_id: string = ""): Promise<any> {
        try {
            if ( chapter_id == "" || chapter_id == undefined) {
                const count: any = await MemberModel.count({});
                return count;
            } else {
                const count: any = await MemberModel.count({ chapter: chapter_id });
                return count;
            }
            
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }

    }

    public async getMembersFromSelectedChapters(chapterList: Array<string>): Promise<any> {
        try {
            const members: any = await MemberModel.find({'chapter': {"$in": chapterList}})
                                                    .populate({
                                                        path: 'user',
                                                        populate: {
                                                            path: 'profile',
                                                        }
                                                    })
                                                    .lean();
            const _: any = require('lodash');
            return _.groupBy(members, 'chapter');
        } catch (e) {
            return {
                error: true,
                message: e.message
            }
        }
    }
}

export default MemberService;