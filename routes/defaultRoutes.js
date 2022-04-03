const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const adminController = require("../controllers/adminController");
const passport =  require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel').User;
const bcrypt = require('bcryptjs');


router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'default';

    next();
})

//Defining local strategy
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback : true

},(req,email,password,done)=>{
    User.findOne({email: email}).then(user=>{
        if(!user){
            return done(null,false,req.flash('error-message','user not found with this mail'));
        }
        bcrypt.compare(password,user.password,(err,passwordMatched)=>{
            if(err){
                return err;
            }
            if (!passwordMatched){
                return done(null,false,req.flash('error-message','Invalid Username or Password '));
            }
            return done(null,user,req.flash('success-message','Login successful '));
        })
    })
}));
passport.serializeUser(function (user,done){
    done(null,user.id);
});
passport.deserializeUser(function (id,done){
    User.findById(id,function (err,user){
        done(err,user);
    });
});


router.route('/')
    .get(defaultController.index);

router.route('/login')
    .get(defaultController.loginGet)
    .post(passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect : '/login',
        failureFlash: true,
        successFlash :true
}),defaultController.loginPost);


router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

module.exports = router;
