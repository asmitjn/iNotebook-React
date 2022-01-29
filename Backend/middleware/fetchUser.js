var jwt = require('jsonwebtoken');
const JWT_SECRET='Asmitis%op';

const fetchUser=(req,res,next)=>{
    //Get the user from the jwt token and iq to req obj
    const token=req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please authenticate using valid token"})
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate using valid token"}) 
    }
}

module.exports=fetchUser;