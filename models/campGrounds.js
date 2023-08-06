const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campGroundSchema = new Schema(
    {
        title:String,
        price:Number,
        image:String,
        description:String,
        location:String,
        author:{
            type:Schema.Types.ObjectId,
            ref:"user"
        },
        reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review"
        }]
    }
);

campGroundSchema.post("findOneAndDelete",async function(campground){
    if(campground){
        const Review = require("./reviews");
        const msg = await Review.deleteMany({_id:{$in:campground.reviews}});
       // console.log(msg);
    }
})

module.exports = mongoose.model('Campground',campGroundSchema);