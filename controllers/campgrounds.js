const Campground = require('../models/campGrounds');
const {cloudinary} = require('../cloudinary');

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campground/index",{campgrounds});
}

module.exports.newCampground = (req,res)=>{
    res.render("campground/new");
}

module.exports.createNewCampground = async(req,res)=>{
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
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
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true,runValidators:true});
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
    }
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