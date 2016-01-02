mySchema=function(mongoose){
        return  hrUserschema = mongoose.Schema({
              firstname: String,
              lastname: String,
              phone: Number,
              pwd:String,
              email: String,
              img: { data: Buffer, contentType: String },
              imgname: String
          });
};
exports.mySchema=mySchema;
