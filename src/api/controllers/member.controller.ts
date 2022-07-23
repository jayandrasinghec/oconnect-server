import MemberService from "services/member.service";

export class MemberController {

    public static async sendInvite(req, res): Promise<any> {
        const inviteObj: any = req.body;
        const response: any = await MemberService.instance.sendInvite(inviteObj);
        if (response.error) {
            return res.status(501).json(response);
        } else {
            return res.status(200).json(response);
        }
    }

    public static async updateInvite(req, res): Promise<any> {
        const { id, status}  = req.params;
        const response: any = await MemberService.instance.updateInviteStatus(id, Number(status));
        if (response.error) {
            return res.status(501).json(response);
        } else {
            return res.status(200).json(response);
        }
    }
    
    public static async getInviteByIdAndStatus(req, res): Promise<any> {
        const { id, inviteStatus}  = req.params;
        const response: any = await MemberService.instance.getInviteByIdAndStatus(id, Number(inviteStatus));
        if (response.error) {
            return res.status(501).json(response);
        } else {
            return res.status(200).json(response);
        }
    }

    public static async getMemberInvites(req, res): Promise<any> {
            const status: any = req.params.status;
            const response : any = await MemberService.instance.getMemberInvites(req.params.user, status);
            return res.status(200).json(response);

       /* if (req.session && req.session["user"] && req.session["user"]["_id"]) {
            
        } else {
           const error =  {
                error: true,
                message : "user in session not found"
            }
            res.status(500).json(error);
        }*/
    }

    public static async count(req, res): Promise <any> {
        const chapter: string = req.params.chapter?req.params.chapter:"";
        const response: any = MemberService.instance.getCount(chapter);
        if ( !response.error ) {
           res.status(200).json(response);
        } else {
            res.status(500).json(response);
        }
    }

    public static async getMembersFromChapters(req, res): Promise<any> {
        const chapters: Array<string> = req.body.chapter?req.body.chapter:[];         
        const response: any = await MemberService.instance.getMembersFromSelectedChapters(chapters);
        if ( !response.error ) {
            res.status(200).json(response);
         } else {
             res.status(500).json(response);
         }
    }
}