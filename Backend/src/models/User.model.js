const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type:String , required:true ,unique:true, lowercase:true},
    password : {type:String , required:true},
    role:{type:String, required:true, enum : ["ADMIN" , "EMPLOYEE"], default:"EMPLOYEE"}
},{timestamps:true});

const UserModel = mongoose.model.UserModel || mongoose.model("User", userSchema);

module.exports = UserModel;


