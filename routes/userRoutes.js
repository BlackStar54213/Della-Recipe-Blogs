// routes/userRoutes.js
import express from 'express';
const router = express.Router();
import { User } from '../modules/user.js';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { recipe } from '../modules/blogs.js';


// passport.js configurations
passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, cb) {
    try {
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.hashed_password);

        if (!isMatch) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }

        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));
// Serialize user into the session
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email }); // Adjust as needed
    });
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redirect to the login page if not authenticated
}
// Deserialize user from the session
passport.deserializeUser(async function (user, cb) {
    try {
        const foundUser = await User.findById(user.id); // Adjust to match serialized user data
        cb(null, foundUser);
    } catch (err) {
        cb(err);
    }
});







//request handlers
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render("register");
});
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    const user = req.user;
    recipe.find({ writer: req.user.name })
        .then((result) => {
            console.log(result);
            res.render("dashboard", { profile: user, blogs: result })
        })
        .catch((err) => console.log(err));
})
router.post("/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))
router.post("/register", async (req, res) => {
    let { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            name: name,
            email: email,
            hashed_password: hashedPassword,
            // Add other fields if necessary
        });

        // Save the user to the database
        await newUser.save();
        console.log('User registered successfully');
        res.redirect('/login');

    } catch (error) {
        console.error('Error registering user:', error.message);
    }
});



router.post("/postblog", (req, res) => {
    const datab = req.body;
    console.log(req.user);


    const newRecipe = new recipe({
        title: datab.title,
        writer: req.user.name,
        snippet: datab.snippet,
        body: datab.body
    })

    newRecipe.save()
        .then((result) => console.log('Blog has been added to database'))
        .catch((err) => console.log(err));
    res.redirect("/all");
})

export default router;
