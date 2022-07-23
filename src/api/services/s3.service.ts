import AWS from "aws-sdk";


class S3Service {

    private static _singleton: boolean = true;
    private static _instance: S3Service;

    private readonly SIGNEDURL_EXPIRY: number = 60 * 60;
    private s3bucket: any;
    constructor() {
        if (S3Service._singleton) {
            throw new SyntaxError("This is a singleton class. Please use S3Serive.instance instead!");
        }
        this.s3bucket = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY_ID, 
            secretAccessKey: process.env.s3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1"
        });
    }

    public static get instance(): S3Service {
        if (!this._instance) {
            this._singleton = false;
            this._instance = new S3Service();
            this._singleton = true;
        }
        return this._instance;
    }

    public async upload(file: any, filename: string) {

        const params = {
            Bucket: "oneness.ksywb",
            Key: `${Date.now().toString()}-${filename}`,
            Body: file
        };
        try {
            return await this.s3bucket.upload(params).promise();
        }catch (e) {
            console.log(e);
            return e;
        }
    }

    public async download(filename: any) {

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filename
        };
        try {
            const resDownload =  await this.s3bucket.getObject(params).promise();
            return resDownload.Body;
        }catch (e) {
            console.log(e);
            return e;
        }
    }

    public async createSignedUrl(key: string, mimeType: string): Promise<any> {
        const params: any = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Expires: this.SIGNEDURL_EXPIRY,
            ACL: "public-read",
            ContentType: mimeType
        };
        const signedURL = this.s3bucket.getSignedUrl("putObject", params);       
        return signedURL;
    }

}

export default S3Service;
