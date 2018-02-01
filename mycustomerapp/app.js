var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('mycustomerapp', ['users']);
//var ObjectId = mongojs.ObjectId;


var app = express();
/*
var logger = function(req, res, next){
    console.log('Logging...');
    next();
}

app.use(logger);
*/
// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

// express validator middleware
app.use(expressValidator()); 

var users = [
    {
    id: 1,
    first_name: 'Maarten',
    last_name: 'van t Wout',
    email: 'maarten@simpact.co'
},
{
    id: 2,
    first_name: 'Erik',
    last_name: 'Vester',
    email: 'erik@simpact.co'
},
{
    id: 3,
    first_name: 'Lodewijk',
    last_name: 'Plei',
    email: 'mongool @simpact.co'
    }
]

app.get('/', function(req, res){
            // find everything
    db.users.find(function (err, docs) {
        // docs is an array of all the documents in mycollection
        console.log(docs);
          var title = 'Customers';
        res.render('index', {
            title: 'Customers',
            users: docs
        });
    })
});

app.post('/users/add', function(req, res){

    req.checkBody('first_name', 'first Name is required').notEmpty();
    req.checkBody('last_name', 'last Name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('index', {
        title: 'Customers',
        users: users,
        errors: errors

        });
    } else {
        var newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            }
            db.users.insert(newUser, function(err, result){
                if(err){
                    console.log(err);
                }
                res.redirect('/');
            });
    }
});

app.delete('/users/delete/:id', function(req, res){
        db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
});

app.listen(3000, function(){
    console.log('Server started on log 3000...');
})