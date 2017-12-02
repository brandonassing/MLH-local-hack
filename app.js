'use strict';

let fs = require('fs');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
var cfenv = require('cfenv');



app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

//mlab data
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://main:main@ds125556.mlab.com:25556/kalusto');

var Symbol = require('./symbol.js');

var db_router = express.Router();
app.use('/api', db_router);
app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next) {
	// res.header('Access-Control-Allow-Origin', "x-requested-with");
	// res.header("Access-Control-Allow-Headers", "*");
	next();
})

app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.get('/', function(req, res) {
	res.render('main.ejs');
});

app.get('/app', function(req, res) {
	res.render('app.ejs');
});

//////////////////////////SYMBOL DB CALLS////////////////////////////////////////////////

db_router.route('/symbols')

// create a tweet (accessed at POST http://localhost:8080/api/tweets)
.post(function(req, res) {

    var sym = new Symbol(); 
    console.log("post");
    // window.alert("hit");
    sym.content = req.body.content; 
    sym.key = req.body.key;

    sym.save(function(err) {
        if (err)
            return res.send(err);

        res.json({
            message: 'Symbol stored'
        });


    });
})

.get(function(req, res) {
    console.log("gotten");
    Symbol.find({}, function(err, sym) {
        if (err)
            return res.send(err);
        res.json(sym);
    });

});

//////////////////////////SYMBOL DB CALLS////////////////////////////////////////////////

var appEnv = cfenv.getAppEnv();
// console.log(appEnv);
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});
