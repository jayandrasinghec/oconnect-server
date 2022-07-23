import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IMember extends Document {
    name: string;
    machine_name: string;
}
interface IMemberModel extends IMember, Document {

}

const Types = Schema.Types;
const MemberSchema: Schema = new Schema({
    user: {type: Types.ObjectId, ref: "User"},
    chapter: {type: Types.ObjectId, ref: "Chapter"},
    isCoordinator: {type: Types.Boolean, default:"false"}
});

const MemberModel: Model<IMemberModel> = model<IMemberModel>("Member", MemberSchema);
export default MemberModel;
