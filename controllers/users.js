const User = require('../models/users');

module.exports.registerForm = (req,res)=>{
    res.render('user/register');
}

module.exports.registerUser = async(req,res)=>{
    try{
        const{username,email,password} = req.body;
        const user = new User({username:username,email:email});
        const newUser = await User.register(user,password);
        req.login(newUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req,res)=>{
    res.render("user/login");
}

module.exports.loginUser = async(req,res)=>{
    req.flash('success','Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    //console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}