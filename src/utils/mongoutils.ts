import UtilityScripts from "./utilityscripts";
import  mongoose from "mongoose";

class MongoUtils {
    public static async findOrCreate(model: any, find: any, create: any): Promise<any> {
        let response: any = await model.findOne(find);
        if (!response) {
            response = await model.create(create);
        }
        return response;
    }

    public static async arrayToCollection(model: any, data: Array<string>): Promise<any> {
        const promises = await data.map(async(item) => {
            console.log(item);
            const machine_name: string = UtilityScripts.machine_name(item);
            console.log(machine_name);
            const modelData: any = await model.findOne({machine_name: machine_name}, "_id");
            console.log(modelData);
            return modelData;
        });
        const result: any = await Promise.all(promises);
        console.log("result", result);

        return result;
    }


    public static toObjectIds(ids: any): any {
        console.log("ids", ids);
        if (ids.constructor === Array) {
            return ids.map(mongoose.Types.ObjectId);
        }
        return mongoose.Types.ObjectId(ids);
    }
    public static async findById (model: any, id: any): Promise<any>  {
        const response = await model.findOne({"_id": id});
        return response;
    }
}

export default MongoUtils;
