import { Document, Schema, Model, model } from "mongoose";
// import findOrCreate from "mongoose-findorcreate";
import UtilityScripts from "../../utils/utilityscripts";

interface IARTICLE extends Document {
    
}
interface IARTICLEModel extends IARTICLE, Document {

}

const Types = Schema.Types;
const ARTICLESchema: Schema = new Schema({
   title: {type: Types.String, required: true, index: true},
   description: {type: Types.String, required: true},
   created_by: {type: Types.ObjectId, ref: 'User', required: true}
});

const FAQModel: Model<IARTICLEModel> = model<IARTICLEModel>("ARTICLE", ARTICLESchema);
export default FAQModel;
