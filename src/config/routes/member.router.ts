import express from "express";
import { MemberController } from "../../api/controllers/member.controller";
const memberRouter = express.Router();

memberRouter.post("/invite", MemberController.sendInvite);
memberRouter.put("/invite/:id/:status", MemberController.updateInvite);
memberRouter.get("/invite/:id/:inviteStatus", MemberController.getInviteByIdAndStatus);
memberRouter.get("/invite/:user/:status?", MemberController.getMemberInvites);
memberRouter.post("/chapters", MemberController.getMembersFromChapters);
memberRouter.get("/count/:chapter?", MemberController.count);

export default memberRouter;