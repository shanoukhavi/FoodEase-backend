import {Request,Response} from "express";
import Restaurant from "../models/restaurant";
const searchRestaurant=async(req:Request, res:Response)=>{
try{
const city=req.params.city;
const searchQuery=(req.query.searchQuery as string) ||"";
const selectedCuisines=(req.query.selectedCuisines as string) || "";
const sortOption=(req.query.sortOption as string) || "lastUpdated";
//for passing ur mongosse querry sort by everything best match deluvery price sestimated delivery time
const page=parseInt(req.query.page as string) || 1;
//any options if filtering or search  if u do the logic is been define for tbhe everyth g u defined it 
//url selectedcyusinse italian burger chineses etc  
let query:any={};

query["city"]=new RegExp(city,"i");
const cityCheck=await Restaurant.countDocuments(query);
//regex will see everythihn which is ssuitable match mate 
//its like how u go for the options which is sort search cisne 
if(cityCheck===0){
    return res.status(404).json({
        data:[],pagination:{
            total:0,page:1,pages:1,
        }
    });
}
if(selectedCuisines){
    //u will get as [italian,burgers,chinesse and stuuff as the array mate  all the elitems in the cusisnesArray mate ]
    const cuisinesArray=selectedCuisines.split(",").map((cuisine)=> new RegExp(cuisine,"i"));
    query["cuisines"]={$all:cuisinesArray};
    //search in base dfor the cusinse mate 
}

if(searchQuery)
{
    
    const searchRegex=new RegExp(searchQuery,"i");
    query["$or"]=[{restaurantName:searchRegex},
        {cuisines:{$in:[searchRegex]}},
    ]
}
const pageSize=10;
//per page mte 
const skip=(page-1)*pageSize;
//sort option if it is gone for lastupdated it wil sort acforing t ot it here 
const restaurants=await Restaurant.find(query).sort({[sortOption]:1}).skip(skip).limit(pageSize).lean();
const total=await Restaurant.countDocuments(query);
const response={
data:restaurants,
pagination:{
    total,page,pages:Math.ceil(total/pageSize),
}
};
res.json(response);
//converted to json and esenf it back 
//how many r there for the query mate 
//everything it removes only other it adds mate 
//or u can filyer by the name of resultant or by the cusines i f u get by search cmponent mate 
    
}catch(error){
    console.log(error);
    res.status(500).json({message:"Error in searching food"});
    //while searchig if the city is not hther eu will get it otherwise u wont 
}
};
export default{
    searchRestaurant
}