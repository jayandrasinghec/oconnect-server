import express from "express";
import { S3Controller }  from "../../api/controllers/s3.controllers";

const s3Router = express.Router();


s3Router.post("/signed/create", S3Controller.getSignedUrl);
s3Router.get("/download/:key*", S3Controller.download);



export default s3Router;