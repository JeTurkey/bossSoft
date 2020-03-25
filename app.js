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
    kid                     = require('./models/kidsDB'),
    mysql                   = require('mysql')



mongoose.connect("mongodb://localhost/bosssoft", {
    useNewUrlParser: true,
    useFindAndModify: false
})

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rayshi1994",
    database: "userModule"
})

con.connect((err) => {
    if(!err){
        console.log('DB connection success')
    }else{
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2))
    }
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
    
    con.query("SELECT * FROM parent", function (err, rst) {
        if (err) {
            console.log(err)
        };
        console.log(rst)
        res.render('index', {
            data: rst
        })
    })
    
    // master.find({}).exec(function(err, rst){
    //     res.render('index', {data: rst})
    // })
    
})

app.get('/addParent', function(req, res){
    res.render('addParent')
})

app.post('/addParent', function(req, res){
    master.create({phonenumber: req.body.phonenumber}, function(err, rst){
        res.redirect('/')
    })
})

// add children page
app.get('/:phonenumber/addChildren', function(req, res){
    res.render('addChildren', {belongto: req.params.phonenumber})
})

app.post('/addChildren', function(req, res){
    var sql = "INSERT INTO children (belongto, phonenumber) VALUES (" + req.body.belongto + ", " + req.body.phonenumber + ");"
    con.query(sql, function(err, rst){
        res.redirect('/')
    })


    // kid.create({
    //     belongto: req.body.belongto,
    //     phonenumber: req.body.phonenumber
    // }, function(err, rst){
    //     res.redirect('/')
    // })
})

app.get('/:phonenumber', function(req, res){
    con.query("SELECT * FROM children WHERE belongto=" + req.params.phonenumber + ";", function(err, rst){
        res.render('kidsMenu', {data: rst, currentNumber: req.params.phonenumber})
    })

    
})

// 编辑号码
app.get('/:belongto/:id/update', function(req, res){
    kid.findById(req.params.id).exec(function(err, rst){
        res.render('updatePage', {data: rst})
    })

})
// 更新号码的POST
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

// Delete号码
app.delete('/:belong/:id/delete', function(req, res){
    var sql = "DELETE FROM children WHERE phonenumber="+req.params.id+";"
    con.query(sql, function(err, rst){
        res.redirect('/')
    })


    // kid.findByIdAndRemove(req.params.id, function(err){
    //     if(err){
    //         res.redirect('/')
    //     }else{
    //         res.redirect('/')
    //     }
    // })
})





// Launching server

app.listen(8080, function(){
    console.log('Server is running')
})