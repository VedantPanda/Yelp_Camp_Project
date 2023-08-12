const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {validateCampground} = require('../middleware');
const {isLoggedIn,isAuthorized} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

//Renders all the campgrounds
router.get("/", catchAsync(campgrounds.index));

//Route to add new campground
router.get("/new",isLoggedIn,campgrounds.newCampground);

//Route to edit existing campground
router.get("/edit/:id", isLoggedIn, isAuthorized, catchAsync(campgrounds.editCampgroundForm));

//Storing the data of the newly created campground in the database
router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground));

//Showing the details of the specific campground
router.get("/show/:id", catchAsync(campgrounds.showCampground));

//Route to delete an existing campground
router.delete("/delete/:id", isLoggedIn, isAuthorized, catchAsync(campgrounds.deleteCampground));

//Stores the edited data into the database
router.put("/edit/:id", isLoggedIn, isAuthorized, validateCampground, catchAsync(campgrounds.editCampground));

module.exports = router;