import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IOrganization extends Document {
    name: string;
    machine_name: string;
}
interface IOrganizationModel extends IOrganization, Document {

}

const Types = Schema.Types;
const OrganizationSchema: Schema = new Schema({
    name: {type: Types.String, required: true},
   logo: {type: Types.ObjectId, ref: 'File'}
});





// RoleSchema.plugin(findOrCreate);
const OriganizationModel: Model<IOrganizationModel> = model<IOrganizationModel>("Organization", OrganizationSchema);
export default OriganizationModel;
