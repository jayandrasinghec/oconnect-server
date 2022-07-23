import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IRole extends Document {
    name: string;
    machine_name: string;
}
interface IRoleModel extends IRole, Document {

}

const Types = Schema.Types;
const RoleSchema: Schema = new Schema({
    name: {type: Types.String, required: true},
    machine_name: {type: Types.String, required: true, unique: true, index: true},
    users: {type: [Types.ObjectId], ref: "User"},
});

/* RoleSchema.pre("validate", (next) => {
    console.log(this.default.model);
    this.machine_name = UtilityScripts.machine_name(this.name);
});*/
RoleSchema.pre<IRole>("validate", function (next: any) {
    this.machine_name = UtilityScripts.machine_name(this.name);
    next();
});


// RoleSchema.plugin(findOrCreate);
const RoleModel: Model<IRoleModel> = model<IRoleModel>("Role", RoleSchema);
export default RoleModel;
