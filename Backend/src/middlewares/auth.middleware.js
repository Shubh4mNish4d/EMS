const jwt = require('jsonwebtoken')


function protect(req, res, next){
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")) return res.status(401).json({error : "Unauthorized"});

        const token = authHeader.split(" ")[1];

        const session =  jwt.verify(token , process.env.JWT_SECRET_KEY);

        if(!session) return res.status(401).json({message:"Unauthorized"});

        req.session = session;

        next();

    }catch(err){
        console.error("Protect error" , err.message);
        res.status(401).json({error : "Unauthorized"});
    }

}

function AdminProtected(req, res, next){

   const role = req.session.role;
   if(!role === "ADMIN") return res.status(400).json({message : "Only Admin can Access"});
   next();

}

module.exports = {protect, AdminProtected}