import mongoose ,{schema} from "mongoose";
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

const Subscription = mongoose.model("subscription", subscriptionSchema);
export default Subscription;