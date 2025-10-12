import jwt from "jsonwebtoken"
//find the token from cookies and through token we get userid
const isAuth = async(req,res,next)=>{
    const {token} = req.cookies;
    console.log(token)
    if(!token){
        return res.json({success:false,message:"Not authorized. Login again"})
    }
    try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(tokenDecode){
            req.userId = tokenDecode.id;
            req.role=tokenDecode.role;
            console.log("user id:"+req.userId + "role "+req.role)
        }else{
        return res.json({success:false,message:"Not authorized. Login again"})
        }
        next();
    }catch(err){
        return res.json({success:false,message:err.message})
        
    }
}

export default isAuth;