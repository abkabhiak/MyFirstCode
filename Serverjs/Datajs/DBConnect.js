module.exports = (function() {
var mongoose = require('mongoose');
var dbUrl="mongodb://localhost:27017/MEANH_01";
mongoose.connect(dbUrl);
/// Schema and Model creations
var hrUserschema=require(__dirname+ '/Mongo_Hruser.js');
mongoose.model('hrUsers', hrUserschema);
return mongoose.model('hrUsers');
})();
