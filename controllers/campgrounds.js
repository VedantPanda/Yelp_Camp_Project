const Campground = require('../models/campGrounds');

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campground/index",{campgrounds});
}

module.exports.newCampground = (req,res)=>{
    res.render("campground/new");
}

module.exports.createNewCampground = async(req,res)=>{
    const newCampground = new Campground(req.body.campground);
    newCampground.image = req.files.map(f=>({url:f.path,filename:f.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully made a new campground!');
    res.redirect(`/campgrounds/show/${newCampground.id}`);
}

module.exports.editCampgroundForm = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/edit",{campground});
}

module.exports.editCampground = async(req,res)=>{
    const{id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true,runValidators:true});
    req.flash("success","Successfully updated campground!");
    res.redirect(`/campgrounds/show/${id}`);
}

module.exports.showCampground = async(req,res)=>{
    const {id} = req.params;
    //console.log(id);
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }
    ).populate('author');
    //console.log(campground);
    if(!campground){
        req.flash("error","Cannot find campground");
        res.redirect("/campgrounds");
    }
    //console.log(campground);
    res.render("campground/show",{campground});
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","Campground deleted successfully!");
    res.redirect("/campgrounds");
}