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
            author:'64c2a38cfef75e2977b40b91',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            images:[
                {
                  url: 'https://res.cloudinary.com/dh8xqptl2/image/upload/v1692508399/Yelpcamp/zfeh8mthxoc76xewy1io.jpg',
                  filename: 'Yelpcamp/zfeh8mthxoc76xewy1io',
                },
                {
                  url: 'https://res.cloudinary.com/dh8xqptl2/image/upload/v1692508400/Yelpcamp/wuwitkwkjml13zatgbma.jpg',
                  filename: 'Yelpcamp/wuwitkwkjml13zatgbma',
                }
              ],
            price:price,
            description:"This is a campground"

        });
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
});