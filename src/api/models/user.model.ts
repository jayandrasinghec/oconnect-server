import { Document, Schema, Model, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {}
interface IUserModel extends IUser, Document {

}

const Types = Schema.Types;
const UserSchema: Schema = new Schema({
    username: {type: Types.String, index: true, unique: true, required: true},
    password: {type: Types.String, required: true},
    resetpassword: {type: Types.Boolean, default: false},
    email: {type: Types.String, unique: true, required: true, index: true},
    mobile: {type: Types.String, unique: true, required: true, index: true},
    lastLoggedIn : {type: Types.Number, default:0},
    roles: { type: [Types.ObjectId], ref: "Role", index: true},
    profile: {type: Types.ObjectId, ref: "UserProfile"},
    members: {type: [Types.ObjectId], ref: "Member"},
    token: { type: Types.String, index: true },
    active: {type: Types.Number, enum:[0,1], default:0},
    full_name: {type: Types.String, required: false}
});

UserSchema.pre<any>("save", function (next: any) {
    if ( this.password && this.isModified('password') ) {
        const user: any = this;
        const saltRounds = 10;
        try {
            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;
            user.token = "";
            return next();
        }catch(e) {
            return next(e);
        }
    }
    return next();  

})

UserSchema.pre<any>('findOneAndUpdate', function(next : any) {
    const password = this._update.password;
    
    if (!password) {
        return next();
    }
    try {
        
        const saltRounds = 10;
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(password, salt);
        this._update.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});;

UserSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})

const UserModel: Model<IUserModel> = model<IUserModel>("User", UserSchema);
export default UserModel;