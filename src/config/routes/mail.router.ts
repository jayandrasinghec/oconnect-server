import express from "express";
import { EmailController }  from "../../api/controllers/email.controller";

const emailRouter = express.Router();


emailRouter.post("/send", EmailController.sendMail);




export default emailRouter;