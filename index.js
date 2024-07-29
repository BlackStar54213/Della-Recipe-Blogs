import express, { application } from "express";
import userRoutes from './routes/userRoutes.js';
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
import { mongoose } from "mongoose";
import { recipe } from './modules/blogs.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import router from "./routes/userRoutes.js";


const Dburi = 'mongodb+srv://DellaBlogs:della54213@cluster0.d4ugy5t.mongodb.net/recipeblogs?retryWrites=true&w=majority&appName=Cluster0  '
mongoose.connect(Dburi)
    .then((result) => app.listen(port, (req, res) => {
        console.log("Connected to Database");
        console.log(`Server activated at port ${port}`);
    }))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'food', // Change this to a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if you're using HTTPS
}));

// Initialize Passport and restore session state
app.use(passport.initialize());
app.use(passport.session());
app.use(userRoutes);
app.use(cookieParser());





app.get("/", (req, res) => {
    recipe.find()
        .then((result) =>
            res.render("index", { blogs: result }))
        .catch((err) => console.log(err));
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.get("/new", (req, res) => {
    res.render("new");
})

app.get("/all", (req, res) => {
    recipe.find()
        .then((result) =>
            res.render("all", { blogs: result }))
        .catch((err) => console.log(err));
})

app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;
    recipe.findById(id)
        .then((result) => res.render("full", { full: result }))
        .catch((err) => console.log(err))
})

app.get("/adminblogs/:id", (req, res) => {
    const id = req.params.id;
    recipe.findById(id)
        .then((result) => res.render("adminfull", { full: result }))
        .catch((err) => console.log(err))
})
// app.get("/login", (req, res) => {
//     res.render("login", { title: "Login Page" });
// })
// app.get("/register", (req, res) => {
//     res.render("register", { title: "Create an Account" });
// })
app.delete("/blogs/:id", (req, res) => {
    const id = req.params.id;

    recipe.findByIdAndDelete(id)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    res.json({ redirect: "/dashboard" });
});




app.use((req, res) => {
    res.status(404).render("404");
})


