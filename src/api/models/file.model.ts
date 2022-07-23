import { Document, Schema, Model, model } from "mongoose";
interface IFile extends Document {
    name: string;
    machine_name: string;
}
interface IFileModel extends IFile, Document {

}

const Types = Schema.Types;
const FileSchema: Schema = new Schema({
    filename: { type: Types.String, required: true },
    mimetype: { type: Types.String, required: true },
    url: { type: Types.String, required: true },
    createdBy: {type: Types.ObjectId, ref: "User", index: true, required: true}
}, { timestamps: true});

FileSchema.pre("validate", function(next) {
    const _self: any = this;
    const url = _self.url;
    const splitUrl = url.split("/");
    const fileName = splitUrl[splitUrl.length - 1];
    _self.filename = fileName.substring(0, fileName.lastIndexOf("."));
    _self.mimetype = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)
    console.log("data", _self.url, _self.filename, _self.mimetype);
    next();
})

FileSchema.pre("findOneAndUpdate", function(next) {
    const _self = this.getUpdate();
    const url = _self.url;
    const splitUrl = url.split("/");
    const fileName = splitUrl[splitUrl.length - 1];
    _self.filename = fileName.substring(0, fileName.lastIndexOf("."));
    _self.mimetype = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)
    console.log("data", _self.url, _self.filename, _self.mimetype);
    next();
})

const FileModel: Model<IFileModel> = model<IFileModel>("File", FileSchema);
export default FileModel;
