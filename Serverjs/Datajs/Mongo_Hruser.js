module.exports = (function() {
var mongoose = require('mongoose');
var hrUserschema = mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: Number,
    pwd:String,
    email: String,
    img: { data: Buffer, contentType: String },
    imgname: String
});
return hrUserschema;
})();
