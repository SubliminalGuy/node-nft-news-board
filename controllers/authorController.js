var Author = require("../database/models/author")

var bcryptjs = require('bcryptjs')

var dotenv = require('dotenv')

const { body, validationResult } = require("express-validator")

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;



// Get Sign-Up Form
exports.signup_get = (req, res, next) => { 
    res.render('signup', {title: "Sign Up"})
};

exports.signup_post = [

    body('first_name', 'First Name required').trim().isLength({min: 2}).escape(),
    body('last_name', 'Family Name required').trim().isLength({min: 3}).escape(),
    body('username', 'Username required').trim().isLength({min: 3}).escape(),
    body('email', 'This has to be a valid email').normalizeEmail().isEmail().escape(),
    body('password', 'Please enter a 6 char password').trim().isLength({min: 6}).escape(),
    body('passwordConfirmation', 'Passwords did not match').exists().custom((value, {req}) => value === req.body.password),

    (req, res, next) => {
        // Extracts the validation Errors from a request.
        const errors = validationResult(req)

        bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {return next(err)}
            // otherwise, store hashedPassword in DB
            else {
                var author = new Author(
                    {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword,
                        avatarUrl: `https://avatars.dicebear.com/api/human/${req.body.username}.svg`,
                        memberstatus: "Newbie"
                    }
                )
        
                if (!errors.isEmpty()) {
                    res.render('signup', {title: "Sign Up", author: author, errors: errors.array()})
                    return;
                }
                else {
                    // Data from form is valid.
                    author.save((err) => {
                        if (err) {return next(err)}
                        // Message saved. Redirect
                        res.redirect("/");
                    });
                }
            }

        });
    }

];

exports.login_get = (req, res, next) => { 
    res.render('signin', {title: "Sign In"})
};

exports.login_post = passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/"
        })

exports.memberlog_get = (req, res, next) => { 
    res.render('memberlog', {title: "Become a member", user: req.user})
};

exports.memberlog_post = [

    body('memberlog', 'This is not the secret password!').trim().isLength({min: 3}).escape(),

    (req, res, next) => {

            // Extracts the validation Errors from a request.
            const errors = validationResult(req)
            
            if (!errors.isEmpty()) {
                res.render('memberlog', {title: "Become a member", user: req.user, errors: errors.array()})
                return;
            }

            var author = new Author(
                {
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    username: req.user.username,
                    email: req.user.email,
                    password: req.user.password,
                    avatarUrl: req.user.avatarUrl,
                    memberstatus: "Member",
                    _id: req.user._id
                }
            )


            if (req.body.memberlog === process.env.MEMBER_PWD) {
                
                    Author.findByIdAndUpdate(req.user._id, author, {}, (err, theauthor) => {
                        if (err) { return next(err)}
                         // Successful
                        res.redirect("/")
                    })
            }
            else {
                res.render('memberlog', {title: "Become a member", user: req.user, errors: [
                    {
                    value: 'fg',
                    msg: 'This is not the secret password!',
                    param: 'memberlog',
                    location: 'body'
                    }
                ]})
            }
        
        }


];

exports.adminlog_get = (req, res, next) => { 
    res.render('adminlog', {title: "Become an admin", user: req.user})
};

exports.adminlog_post = [

    body('adminlog', 'This is not the secret password!').trim().isLength({min: 3}).escape(),

    (req, res, next) => {

            // Extracts the validation Errors from a request.
            const errors = validationResult(req)
            
            if (!errors.isEmpty()) {
                res.render('adminlog', {title: "Become an admin", user: req.user, errors: errors.array()})
                return;
            }

            var author = new Author(
                {
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    username: req.user.username,
                    email: req.user.email,
                    password: req.user.password,
                    avatarUrl: req.user.avatarUrl,
                    memberstatus: "Admin",
                    _id: req.user._id
                }
            )


            if (req.body.adminlog === process.env.ADMIN_PWD) {
                
                    Author.findByIdAndUpdate(req.user._id, author, {}, (err, theauthor) => {
                        if (err) { return next(err)}
                         // Successful
                        res.redirect("/")
                    })
            }
            else {
                res.render('adminlog', {title: "Become an admin", user: req.user, errors: [
                    {
                    value: 'fg',
                    msg: 'This is not the secret password!',
                    param: 'adminlog',
                    location: 'body'
                    }
                ]})
            }
        
        }


];







passport.use(
    new LocalStrategy((username, password, done) => {
        

        Author.findOne({ username: username }, (err, user) => {

            

            if (err) { 
            return done(err);
            }
            if (!user) {
            return done(null, false, { message: "Incorrect username" });
            }
            bcryptjs.compare(password, user.password, (err, res) => {
                if (res) {
                  // passwords match! log user in
                    return done(null, user)
                } else {
                  // passwords do not match!
                    return done(null, false, { message: "Incorrect password" })
                }
            })
            
        });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Author.findById(id, function(err, user) {
        done(err, user);
    });
  });
        
exports.logout_get = (req, res) => { 
        req.logout();
        res.redirect("/");
};