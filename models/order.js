const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const orderSchema=new Schema({
    products:{
        type:[],
        required:true   
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
});
module.exports=mongoose.model("Order",orderSchema);