import mongoose, {Schema} from "mongoose";

const tweetSchema =new mongoose.Schema({
    content:{
        type: String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref :"User"
    }
},{timestamps:true})

const Tweet = mongoose.model("tweet", tweetSchema)
export default Tweet