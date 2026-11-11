require("dotenv").config()
const connectDB = require("./src/config/db");
const UserModel = require("./src/models/user.model");
const bcrypt = require('bcryptjs')


async function createAdmin(){
    try{
        const email = process.env.ADMIN_EMAIL;
        const password = "admin123"

        if(!email){
            console.log("Missing admin email in env file");
            return
        }

        await connectDB();

        const isAdminExist = await UserModel.findOne({email});

        if(isAdminExist){
            console.error("Admin already exists");
            return
        }

        const hashed = await bcrypt.hash(password, 10)

        const admin = await UserModel.create({
            email : "admin.ems@gmail.com",
            password : hashed,
            role : "ADMIN"
        });

        console.log(`New admin is created, email : ${admin.email} , password : ${password}`);
    }
    catch(err){
        console.error("Create Admin Error", err.message);
    }
}

createAdmin();