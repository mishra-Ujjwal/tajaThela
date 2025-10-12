import mongoose, { mongo } from "mongoose"
const vegetableMasterSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    image:{
        type:String,
    },
},
)
const vegetableModel = mongoose.model("vegetableMaster",vegetableMasterSchema)
export default vegetableModel;