import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IChapter extends Document {
    name: string;
    machine_name: string;
}
interface IChapterModel extends IChapter, Document {

}

const Types = Schema.Types;
const ChapterSchema: Schema = new Schema({
    name: {type: Types.String, required: true},
    machine_name: {type: Types.String, required: true, unique: true, index: true},
    organization: {type: Types.ObjectId, ref: "Organization", required: true, index: true},
    role: {type: Types.ObjectId, ref:"Role", required: false},
    coordinator: {type: Types.ObjectId, ref: "Member"},
    members: {type: [Types.ObjectId], ref: "Member"},
    parent: {type: Types.ObjectId, ref: "Chapter"},
    children: {type: [Types.ObjectId], ref: "Chapter"},
    weightage: {type: Types.Number}
});

/* RoleSchema.pre("validate", (next) => {
    console.log(this.default.model);
    this.machine_name = UtilityScripts.machine_name(this.name);
});*/
ChapterSchema.pre<IChapter>("validate", function (next: any) {
    this.machine_name = UtilityScripts.machine_name(this.name);
    next();
});


// RoleSchema.plugin(findOrCreate);
const ChapterModel: Model<IChapterModel> = model<IChapterModel>("Chapter", ChapterSchema);
export default ChapterModel;
