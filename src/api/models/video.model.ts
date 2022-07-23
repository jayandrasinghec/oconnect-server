import { Document, Schema, Model, model } from "mongoose";

interface IVideo extends Document {
}
interface IVideoModel extends IVideo, Document {
    
}

const Types = Schema.Types;
const VideoSchema: Schema = new Schema({
   title: {type: Types.String, required: true},
   description: {type: Types.String},
   videoUrl: {type: Types.ObjectId, ref:"File",  required: true},
   thumbnail: {type: Types.ObjectId, ref: "File", required: true}
}, {timestamps: true});


const VideoModel: Model<IVideoModel> = model<IVideoModel>("Video", VideoSchema);
export default VideoModel;