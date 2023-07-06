const mongoose = require('mongoose');
const Campground = require('../models/campGrounds');
const cities = require('./cities');
const {descriptors,places} = require('./seedHelpers');

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

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDb = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:"https://source.unsplash.com/collection/483251/400x400",
            price:price,
            description:"This is a campground"

        });
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
});