import express from "express";
import { Organization } from "controllers/org.controller";
import { ChapterController } from "controllers/chapter.controller";
import { FaqController } from "controllers/faq.controller";
import { ArticleController } from "controllers/article.controller";

const orgRouter = express.Router();


orgRouter.get("/", Organization.getOne)
orgRouter.post("/", Organization.createNew);
orgRouter.post("/chapter", ChapterController.create)
orgRouter.get("/:organizationId/chapters/:chapterId?", ChapterController.get);
orgRouter.get("/:organizationId/chapters/weightage/:weightageId",ChapterController.getByWeightage);
orgRouter.get("/chapter/:chapterId",ChapterController.getById);
orgRouter.get("/:organizationId/chapters",ChapterController.getByOrganization);

orgRouter.post("/add/faq",FaqController.add);
orgRouter.get("/get/faq",FaqController.get);
orgRouter.post("/add/article",ArticleController.add);
orgRouter.get("/get/articles",ArticleController.get);



export default orgRouter;