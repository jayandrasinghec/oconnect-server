import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IFAQ extends Document {
    
}
interface IFAQModel extends IFAQ, Document {

}

const Types = Schema.Types;
const FAQSchema: Schema = new Schema({
   question: {type: Types.String, required: true, index: true},
   answer: {type: Types.String, required: true},
   created_by: {type: Types.ObjectId, ref: 'User', required: true}
});

const FAQModel: Model<IFAQModel> = model<IFAQModel>("FAQ", FAQSchema);
export default FAQModel;
