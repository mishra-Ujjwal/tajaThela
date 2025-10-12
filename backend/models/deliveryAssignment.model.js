import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order"
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    broadcastedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        default:null,
    },
    status:{
        type:String,
        enum:["broadcasted","assigned","delivered"],
        default:"broadcasted",
    },
    acceptedAt:Date,
},{timestamps:true})
const deliveryModel = mongoose.model("delivery",deliveryAssignmentSchema);
export default deliveryModel;