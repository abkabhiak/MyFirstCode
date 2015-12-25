
//using express module
var express = require('express');
// creating express object
var app = express();

app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');

var busboy = require('connect-busboy');
app.use(busboy());

///////////////////////////////////////// Mongoose items //////////////////////////////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/MEANH_01');
/*
var kittySchema = mongoose.Schema({
    name: String
});
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}
*/

//var Kitten = mongoose.model('Kitten', kittySchema);


//var silence = new Kitten({ name: 'Silence' });
//console.log(silence.name); // 'Silence'

//var fluffy = new Kitten({ name: 'fluffy' });
//fluffy.speak(); // "Meow name is fluffy"

/*
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});
*/
//Kitten.find(function (err, kittens) {
//  if (err) return console.error(err);
//  console.log(kittens);
//})

mongoose.connection.on('error',function (err) {
 console.log('Mongoose connection error: ' + err);
});

process.on('SIGINT', function() {
 mongoose.connection.close(function () {
 console.log('Mongoose disconnected through app termination');
 process.exit(0);
 });
});
///////////////////////////////////////// Mongoose Form items //////////////////////////////////////////////////////

var hrUserschema = mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: Number,
    pwd:String,
    email: String
//    img: { data: Buffer, contentType: String }
});

var hrusers = mongoose.model('hrUsers', hrUserschema);

//var hr1= new hrusers({firstname:"Abhishek",lastname:"Kumar",phone:8881212,pwd:"12345",email:"abk@abk.com"});
//console.log(hr1.firstname);

//hr1.save(function (err, hr1) {
//  if (err) return console.error(err);
//});



/*
///Using Custome Modules
*/
var fortune = require('./libj/fortune.js');


// set up handlebars view engine
var handlebars = require('express3-handlebars')
.create({ defaultLayout:'main',
helpers: {
section: function(name, options){
if(!this._sections) this._sections = {};
this._sections[name] = options.fn(this);
return null;
}
}});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Setting Port of HTTP Host
app.set('port', process.env.PORT || 3000);







///////////////////////////////////////// Page Navigation //////////////////////////////////////////////////////





// to open the page as per the url path
app.get('/', function(req, res) {
res.render('home');
});


app.get('/about', function(req, res){
res.render('about', { fortunesd: fortune.getFortune()});
});


app.get('/register', function(req, res){
res.render('register');
});

app.get('/headers', function(req,res){
res.set('Content-Type','text/plain');
var s = '';
for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
res.send(s);
});

/// Form Post method handling try 1
app.get('/thank_you', function(req, res){
res.render('thank_you');
//res.sendFile(path.resolve('./TempFiles/'+ imgfilename));
});

app.get('/image.png', function (req, res) {
    res.sendfile(path.resolve('./TempFiles/'+ imgfilename));
});




var imgfilename;
app.post('/process', function(req, res){
console.log('Name (from visible form field): ' + req.body.first_name+ req.body.last_name);
console.log('Phone (from visible form field): ' + req.body.phone_number);
console.log('Email (from visible form field): ' + req.body.email);
console.log(req.ip);
var fstream;
req.pipe(req.busboy);
req.busboy.on('file', function (fieldname, file, filename) {
console.log("Uploading: " + filename);
//Path where image will be uploaded
fstream = fs.createWriteStream(__dirname + '/TempFiles/' + filename);

imgfilename=filename
console.log("File name is : "+imgfilename);
file.pipe(fstream);
fstream.on('close', function () {
console.log("Upload Finished of " + filename);
});
});

var ffname=req.body.first_name;
var llname=req.body.last_name;
var pnumber=req.body.phone_number;
var emid=req.body.email;
var pwd=req.body.password;
var hr2= new hrusers({firstname:ffname,lastname:llname,phone:pnumber,pwd:pwd,email:emid});
console.log(hr2.firstname);
  hr2.save(function (err, hr2) {
  if (err) return console.error(err);
  });
res.redirect(303, '/thank_you');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
res.status(404);
res.render('404');
});
// 500 error handler (middleware)
app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500);
res.render('500');
});

// starting the Server
app.listen(app.get('port'), function(){console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' )});
