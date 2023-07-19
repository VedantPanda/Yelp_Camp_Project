const express= require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campGrounds');
const {reviewSchema} = require('./validateSchemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/reviews');
const campgroundRoutes = require('./routes/campgrounds');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
    //useCreateIndex:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected!");
})

app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

app.use("/campgrounds",campgroundRoutes);



const validateReview = (req,res,next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

app.get("/",(req,res)=>{
    res.render('home')
})




app.post("/campgrounds/:id/review", validateReview, catchAsync(async(req,res)=>{
    const{id} = req.params;
    const review = new Review(req.body.review);
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/show/${campground.id}`);
}))

app.delete("/campgrounds/:id/reviews/:reviewId",catchAsync(async(req,res)=>{
    const campgroundId = req.params.id;
    const {reviewId} = req.params;
    await Campground.findByIdAndUpdate(campgroundId,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/show/${campgroundId}`);
}))

//Used to throw error to the error handling middleware when a route is called which does not exist
app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found",404));
})

//Error Handling Middleware
app.use((err,req,res,next)=>{
    const{statusCode=500} = err;
    if(!err.message){
        err.message = "Something went wrong";
    }
    res.status(statusCode).render('errors',{err});
})

app.listen(port,()=>{
    console.log("Server Started!!!");
})