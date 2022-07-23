import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IMemberInvite extends Document {
    name: string;
    machine_name: string;
}
interface IMemberInviteModel extends IMemberInvite, Document {

}

const Types = Schema.Types;
const MemberInviteSchema: Schema = new Schema({
    email: {type: Types.String, required: true, index: true},
    chapter: {type: Types.ObjectId, ref: "Chapter", required: true, index: true},
    isCoordinator: {type: Types.Boolean, default:"false"},
    status: {type: Types.String, enum: [0, 1], default: 0},
    createdBy: {type: Types.ObjectId, ref:"User", required: true, index: true}
}, {
    timestamps: true
});

const MemberInviteModel: Model<IMemberInviteModel> = model<IMemberInviteModel>("MemberInvite", MemberInviteSchema);
export default MemberInviteModel;
