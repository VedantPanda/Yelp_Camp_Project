const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
})

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;