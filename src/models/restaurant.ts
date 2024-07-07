// property for storing the info 
import mongoose, { InferSchemaType } from "mongoose";
const menuItemSchema=new mongoose.Schema(
    {
        _id:{type:mongoose.Schema.Types.ObjectId,required:true,default:()=>new mongoose.Types.ObjectId()},
        name:{type:String,required:true},
        price:{type:Number,required:true},
    }
)
export type MenuItemType=InferSchemaType<typeof menuItemSchema>;
const restaurantSchema=new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ,
    restaurantName:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    deliveryPrice:{
        type:Number,
        required:true
    },
    estimateDeliveryTime:{
        type:Number,
        required:true
    },
    cuisines:[{
        type:String,
        required:true
    }],
    // becuase it could be many as indian chinese  anythng mate 
    menuItems:[menuItemSchema],
    imageUrl:{type:String, required:true},
    // only the url is been stored then the image is been stored in cloudinary 
    lastUpdate:{type:Date,required:true},

});
const Restaurant=mongoose.model("Restaurant",restaurantSchema);
export default Restaurant;
