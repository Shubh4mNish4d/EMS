const EmployeeModel = require("../models/Employe.model");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User.model");


async function login(req, res){
   try{
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message:"Required input fiels"});

        const user = await UserModel.findOne({email});

        if(!user) return res.status(401).json({error: "User not found, Please check your email!"})

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(401).json({error: "Invaild password"});

        const payload = {
            userId: user._id,
            role: user.role,
            email:user.email
        }
        
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
        
        res.status(201).json({success:true, user :payload,  token});

   }catch(err){
        console.log("Login error", err.message);
        res.status(500).json({error: "Login error"});
   }
}

function session(req, res){
   const session =  req.session;
   return res.json({user : session});
};


async function updatePassword(req, res){
   try{
        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword) return res.status(400).json({error : "Missing input fields"});

        const user = await UserModel.findById(req.session.userId);

        if(!user) return res.status(404).json({error: "User not found"})

        const isMatched = await bcrypt.compare(currentPassword, user.password);

        if(!isMatched) return res.status(400).json({error : "Incorrect password"});

        const hashed = await bcrypt.hash(newPassword, 10);

        await UserModel.findByIdAndUpdate(req.session.userId , {password : hashed});

        return res.json({success : true})

   }catch(err){
    
        console.error("Update Password error", err.message);
        res.status(500).json({error : "Update Password error"});
   }
};

module.exports = {login, session, updatePassword};