import mongoose, {Schema} from "mongoose";

const likeSchema = new mongoose.Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref :"Video"
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref :"Comment"
    },
    Tweet:{
        type:Schema.Types.ObjectId,
        ref :"Tweet"
    },
    Likeby:{
        type:Schema.Types.ObjectId,
        ref :"User"
    }
},{timestamps:true})

const Like = mongoose.model("Like", likeSchema)
export default Like;