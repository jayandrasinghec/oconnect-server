/// const express = require("express");
import express from "express";
import { AuthController } from 'controllers/auth.controller';

const authRouter = express.Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/validate-username/:username", AuthController.validateUsername);
authRouter.post("/signup", AuthController.signup);
authRouter.put("/resetpassword", AuthController.resetPassword);


export default authRouter;