var express = require('express')
  , router = express.Router();

  // to open the page as per the url path
  router.get('/', function(req, res) {
  res.render('home');
  });

  router.get('/chatroom', function(req, res) {
  res.render('chatroom');
  });

  router.get('/about', function(req, res){
  res.render('about', { fortunesd: fortune.getFortune()});
  });


  router.get('/register', function(req, res){
  res.render('register');
  });

  router.get('/headers', function(req,res){
  res.set('Content-Type','text/plain');
  var s = '';
  for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
  res.send(s);
  });

  /// Form Post method handling try 1
  router.get('/thank_you', function(req, res){
  res.render('thank_you');
  //res.sendFile(path.resolve('./TempFiles/'+imgfilename));
  });

  router.get('/image.png', function (req, res) {
      res.sendFile(path.resolve('./TempFiles/'+imgfilename));

  });


  var ffname;
  var llname;
  var pnumber;
  var emid;
  var pwd;
  var newpath;
  var imgfilename;
  router.post('/process', function(req, res){
  /////// Busboy try
  if (req.method === 'POST') {
      var busboy = new Busboy({ headers: req.headers });
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

            var fstream;
            console.log("Uploading: " + filename);
             //Path where image will be uploaded
             newpath=__dirname + '/TempFiles/' + filename;
             fstream = fs.createWriteStream(__dirname + '/TempFiles/' + filename);
             console.log("This the newpath value "+newpath);
             imgfilename=filename;
             file.pipe(fstream);
             fstream.on('close', function () {
             console.log("Upload Finished of " + filename);
             });

        file.on('data', function(data) {
          console.log('File [' + fieldname + '] got ' + data.length + ' bytes');

        });
        file.on('end', function() {
          console.log('File [' + fieldname + '] Finished');
        });
      });
      busboy.on('field', function(key, value, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log('Key [' + key + ']: value: ' + value);
          switch (key) {
            case 'first_name':
              ffname=value;
              break;
            case  'last_name':
              llname=value;
              break;
            case  'phone_number':
              pnumber=value;
                break;
            case  'password':
              pwd=value;
                break;
            case  'email':
              emid=value;
                break;
            default:
              Console.log(key);

          }
      });
      busboy.on('finish', function() {
        console.log('Done parsing form!');
        console.log('Name (from visible form field): ' + ffname + llname);
        console.log('Phone (from visible form field): ' + pnumber);
        console.log('Email (from visible form field): ' + emid);
        console.log(req.ip);
        hr1.firstname=ffname;
        hr1.lastname=llname;
        hr1.phone=pnumber;
        hr1.pwd=pwd;
        hr1.email=emid;
        hr1.img.data=newpath;
        hr1.img.contentType='image/png';
        hr1.imgname=imgfilename
        console.log(hr1.firstname);
          hr1.save(function (err, hr1) {
          if (err) return console.error(err);
          });
          var myimgpath;
          console.log('File path '+ hr1.img.data);
          myimgpath=(hr1.img.data).toString();
          console.log('File real path '+ myimgpath);
        res.redirect(303, '/thank_you');
      });
      req.pipe(busboy);
    }

    //////////////////
  });

  router.get('/login', function(req, res){
  res.render('login');
  //res.sendFile(path.resolve('./TempFiles/'+imgfilename));
  });


  router.get('/profilepage', function(req, res){
  res.render('ProfilePage');
  //res.sendFile(path.resolve('./TempFiles/'+imgfilename));
  });



  router.post('/loginuser',function(req,res){
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('field', function(key, value, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Key [' + key + ']: value: ' + value);
        switch (key) {
          case 'email':
            emid=value;
            break;
          case  'password':
            pwd=value;
            break;
          default:
            Console.log(key);

        }
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      console.log('Email (from visible form field): ' + emid);
      console.log('Password (from the visible filed): '+pwd);

      console.log(req.ip);
      hrusers.findOne({ 'email': emid}, function (err, doc){
        if(err) {
          console.log('Error occured' +err);
      }
        if(doc){
          if(doc.pwd==pwd){
            imgfilename=doc.imgname;
            res.redirect(303, '/thank_you');
          }else {
            imgfilename="";
            res.render('404');
          }
        }
        });
    });
    req.pipe(busboy);
    });


  // 404 catch-all handler (middleware)
  router.use(function(req, res, next){
  res.status(404);
  res.render('404');
  });
  // 500 error handler (middleware)
  router.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
  });

  module.exports = router;
