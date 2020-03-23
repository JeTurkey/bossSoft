var express                 = require('express'),
    expressSanitizer        = require('express-sanitizer'),
    bodyParser              = require('body-parser'),
    methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/users"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    master                  = require('./models/mastersDB'),
    kid                     = require('./models/kidsDB')



mongoose.connect("mongodb://localhost/bosssoft", {
    useNewUrlParser: true,
    useFindAndModify: false
})

var app = express();
app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}))

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    
    next();
})


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res){
    master.find({}).exec(function(err, rst){
        res.render('index', {data: rst})
    })
    
})

app.get('/addParent', function(req, res){
    res.render('addParent')
})

app.post('/addParent', function(req, res){
    master.create({phonenumber: req.body.phonenumber}, function(err, rst){
        res.redirect('/')
    })
})

app.get('/:phonenumber/addChildren', function(req, res){
    res.render('addChildren', {belongto: req.params.phonenumber})
})

app.post('/addChildren', function(req, res){
    kid.create({
        belongto: req.body.belongto,
        phonenumber: req.body.phonenumber
    }, function(err, rst){
        res.redirect('/')
    })
})

app.get('/:phonenumber', function(req, res){
    kid.find({belongto: req.params.phonenumber}).exec(function(err, rst){
        res.render('kidsMenu', {data: rst, currentNumber: req.params.phonenumber})
    })
})

app.get('/:belongto/:id/update', function(req, res){
    kid.findById(req.params.id).exec(function(err, rst){
        res.render('updatePage', {data: rst})
    })

})

app.put('/:belongto/:id/update', function(req, res){
    kid.findByIdAndUpdate(req.params.id, req.body.info, function(err, rst){
        if(err){
            res.redirect('/')
        }else{
            console.log(req.body.info)
            console.log(rst)
            console.log("success")
            res.redirect('/')
        }
    })
})

app.delete('/:belong/:id/delete', function(req, res){
    kid.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/')
        }else{
            res.redirect('/')
        }
    })
})





// Launching server

app.listen(8080, function(){
    console.log('Server is running')
})