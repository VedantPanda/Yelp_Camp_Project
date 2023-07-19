const express= require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

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
app.use("/campgrounds/:id/review",reviewRoutes);

app.get("/",(req,res)=>{
    res.render('home')
})

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