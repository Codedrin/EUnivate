import mongoose from "mongoose";
const Schema = mongoose.Schema;
const quotationTokenSchema = new Schema ({
    quotationId: {
        type: String,
        ref:"Quotation",
        required: true,
    },

    quotationToken:{
        type:String,
        required:true,
    }
});

const quotationTokenModel = mongoose.model("quotationToken", quotationTokenSchema);
export default quotationTokenModel;