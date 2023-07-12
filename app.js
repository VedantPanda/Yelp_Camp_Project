const express= require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campGrounds');
const review = require("./models/reviews");
const {campgroundSchema} = require('./validateSchemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/reviews');

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

app.get("/",(req,res)=>{
    res.render('home')
})

//Renders all the campgrounds
app.get("/campgrounds", catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campground/index",{campgrounds});
}))

//Route to add new campground
app.get("/campgrounds/new",(req,res)=>{
    res.render("campground/new");
})

//Route to edit existing campground
app.get("/campgrounds/edit/:id", catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/edit",{campground});
}))

//Storing the data of the newly created campground in the database
app.post("/campgrounds", catchAsync(async(req,res)=>{
    const {error} = campgroundSchema.validate(req.body);
    //console.log(error);
    if(error){
        const msg = error.details.map((el)=>el.message).join(",");
        //console.log(msg);
        throw new ExpressError(msg,400);
    }
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/show/${newCampground.id}`);
}))

//Showing the details of the specific campground
app.get("/campgrounds/show/:id", catchAsync(async(req,res)=>{
    const {id} = req.params;
    //console.log(id);
    const campground = await Campground.findById(id);
    //console.log(campground);
    res.render("campground/show",{campground});
}))

//Route to delete an existing campground
app.delete("/campgrounds/delete/:id", catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

//Stores the edited data into the database
app.put("/campgrounds/edit/:id", catchAsync(async(req,res)=>{
    const {error} = campgroundSchema.validate(req.body);
    console.log(req.body);
    if(error){
        const msg = error.details.map((el)=>el.message).join(",");
        //console.log(msg);
        throw new ExpressError(msg,400);
    }
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true,runValidators:true});
    res.redirect(`/campgrounds/show/${campground.id}`);
}))

app.post("/campgrounds/:id/review",catchAsync(async(req,res)=>{
    const{id} = req.params;
    const review = new Review(req.body.review);
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/show/${campground.id}`);
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