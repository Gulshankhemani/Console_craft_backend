import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new mongoose.Schema(
    {
        videoFile:{
            type: String, //cloudinary url
            required:true,
        },

        Thumbnail:{
            type: String,
            required:true,
        },
        title:{
            type: String,
            required:true,
        },
        discription:{
            type: String,
            required:true,
        },
        duration:{
            type: Number,
            required:true,
        },
        views:{
            type: Number,
            default: 0,
        },
        isPublished:{
            type:boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }

},{timestamps: true});

VideoSchema.plugin(mongooseAggregatePaginate); 


const Video = mongoose.model("Video", VideoSchema);
export default Video;