//import asyncBusboy from "async-busboy";
import fs from "fs";
import path from "path";

import S3Serive from "../services/s3.service";

export class S3Controller {


        public static async getSignedUrl(req, res): Promise<any> {
            try {
                const body = req.body;
                const response = await S3Serive.instance.createSignedUrl(body.key, body.mimeType);
                res.json(response);           
            } catch (e) {
            console.log(e);
            return e;
           
            }
        }
        public static async upload(req, res) {
            try {
                    const body = req.body;
                    const response = await S3Serive.instance.upload(body.file, body.filename);
                    res.json(response);           
            } catch (e) {
                console.log(e);
                return e;
          
            }    
        }
       public static async download(req, res) {
            
       }




}
