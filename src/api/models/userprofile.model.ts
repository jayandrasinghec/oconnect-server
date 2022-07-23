import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IUserProfile extends Document {
    name: string;
    machine_name: string;
}
interface IUserProfileModel extends IUserProfile, Document {

}

const Types = Schema.Types;
const UserProfileSchema: Schema = new Schema({
    firstname: {type: Types.String, required: true},
    lastname: {type: Types.String, required: true},
    gender: {type: Types.String, required: true},
    dob: {type: Types.String},
    location: {type: Types.String},
    address: {type: Types.String},
    about_me: {type:Types.String},
    area_of_interest: {type:Types.String},
    photo: {type: Types.ObjectId, ref: "File"},
    user: {type: Types.ObjectId, ref: "User"}
});

/* UserProfileSchema.pre("validate", (next) => {
    console.log(this.default.model);
    this.machine_name = UtilityScripts.machine_name(this.name);
});*/


// UserProfileSchema.plugin(findOrCreate);
const UserProfileModel: Model<IUserProfileModel> = model<IUserProfileModel>("UserProfile", UserProfileSchema);
export default UserProfileModel;
