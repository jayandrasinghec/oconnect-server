/// const express = require("express");
import express from "express";
import { AdminController } from "../../api/controllers/admin.controller";


const adminRouter = express.Router();

adminRouter.post("/member/add", AdminController.addmember);




export default adminRouter;