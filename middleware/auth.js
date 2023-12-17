import jwt from 'jsonwebtoken'
import  {userModel}  from '../DB/models/user.model.js';

export const auth = () => {
    return async (req, res, next) => {
    try {
        
   
            let { authorization } = req.headers
            if (authorization && authorization.startsWith('Bearer')) {
                let token = authorization.split(" ")[1];
                let verfied = jwt.verify(token, process.env.JWTKEY);
                if (verfied) {
                    let user = await userModel.findById(verfied.id);
                    if (user) {
                        req.user = user;
                        next()
                    } else {
                        res.json({message:"invalid user"})
                    }
                } else {
                    res.json({message:"invalid token"})
                }
            } else {
                   res.json({ message: "invalid token or not send" });
            }
        
    } catch (error) {
        res.status(404).json({message:'error',error});
    }}
    
};