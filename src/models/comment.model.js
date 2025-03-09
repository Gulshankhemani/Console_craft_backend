import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema =new mongoose.Schema({
    
    content :{
        type: String, //cloudinary url
        required:true,
    },
    video:{
        type:Schema.Types.ObjectId,
        ref :"Video"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref :"User"
    }

},{timestamps:true})


VideoSchema.plugin(mongooseAggregatePaginate); 

const Comment = mongoose.model("coment", CommentSchema)

export default Comment
