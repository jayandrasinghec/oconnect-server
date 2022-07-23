import { MainController } from "controllers/main.controller";
import { UserController } from "controllers/user.controller";
import { AuthController } from 'controllers/auth.controller';
import { Organization } from "controllers/org.controller";
import { S3Controller }  from "controllers/s3.controllers";
import { ChapterController } from "controllers/chapter.controller";
import authRouter  from "./routes/auth.router";
import userRouter from "./routes/user.router";
import orgRouter from "./routes/org.router";
import s3Router from "./routes/s3.router";
import emailRouter from "./routes/mail.router";
import memberRouter from "./routes/member.router";
import adminRouter from "./routes/admin.router";

class RouterConfig {
    private static readonly API_PATH: String = "api/v1";
    public static routes(router: any): any {
        router.get("/", MainController.index);
        
        router.use("/auth", authRouter);
        router.use(`/${this.API_PATH}/user`, userRouter);
        router.use(`/${this.API_PATH}/org`, orgRouter);
        router.use(`/${this.API_PATH}/s3`, s3Router);
        router.use(`/${this.API_PATH}/mail`, emailRouter);
        router.use(`/${this.API_PATH}/member`, memberRouter);
        router.use(`/${this.API_PATH}/admin`, adminRouter);

    }
}

export default RouterConfig;
