/// const express = require("express");
import express from "express";
import { RoleController } from "controllers/role.controller";
import { UserController } from '../../api/controllers/user.controller';

const userRouter = express.Router();

userRouter.post("/role", RoleController.create);
userRouter.get("/:id", UserController.getUser);
userRouter.post("/profile/:userid", UserController.addProfile);
userRouter.get("/", UserController.getUsers);
userRouter.put("/status", UserController.updateActiveStatus);




export default userRouter;