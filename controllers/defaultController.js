const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const User = require('../models/UserModel').User;
const bcrypt = require('bcryptjs');




module.exports={
    index:  async (req, res) => {
        let {page,size} = req.query;
        if(!page){
            page=1;
        }
        if(!size){
            size=5;
        }
        const limit= parseInt(size);
        const skip = (page-1)*size;

        const posts = await Post.find().lean().limit(limit).skip(skip);
        const categories = await Category.find().lean();
        res.render('default/index', {posts: posts, categories: categories});
    },
    loginGet: (req, res) => {
        res.render('default/login');
    },

    loginPost: (req, res) => {
        res.send("Congratulations, you've successfully submitted the data.");
    },
    registerGet: (req, res) => {
        res.render('default/register');
    },

    registerPost: (req, res ) => {

        // res.send("Successfully Registered.");
        let errors =[];
        if (!req.body.firstName){
            errors.push({message: 'First name is mandatory'})
        }
        if (!req.body.lastName){
            errors.push({message: 'Last name is mandatory'})
        }
        if (!req.body.email){
            errors.push({message: 'Email is mandatory'})
        }
        if (req.body.password !== req.body.passwordConfirm){
            errors.push({message: 'password do not match'})
        }
        if(errors.length>0){
            console.log(errors);
            res.render('default/register',{
                errors: errors,
                firstName: req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email

            });
        }
        else{
            User.findOne({email: req.body.email}).then(user=>
                {
                    if(user){
                        req.flash('error-message','Email Already exist,try another one');
                        res.redirect('.login');
                    }
                    else{
                        const newUser = new User(req.body);
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                                newUser.password= hash;
                                newUser.save().then(user=>{
                                    req.flash('success-message', 'You are now registered');
                                    res.redirect('/login');
                                });
                            });
                        });

                    }
                }



            );
        }
    }
};
