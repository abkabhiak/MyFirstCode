myDbConnect=function(mongoose,hr1){
                var dbUrl="mongodb://localhost:27017/MEANH_01";
                mongoose.connect(dbUrl);
                /// Schema import and Model creations
                var myS=require(__dirname+ '/Mongo_Hruser.js');
                var hrUserschema=myS.mySchema(mongoose);
                var hrUsers=mongoose.model('hrUsers',hrUserschema);
                hr1= new hrUsers();
};
exports.myDbConnect=myDbConnect;
