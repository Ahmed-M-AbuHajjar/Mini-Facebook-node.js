import multer from 'multer';

export const validationTypes = {
    image:['image/png','image/jpg','image/jpeg']
}

export const HME = (err,req,res,next)=> {
    if(err){
        res.status(400).json({message:'multer error',err})
    } else {
        next()
    }
}

export const myMulter = (acceptType) => {

 

 const storage = multer.diskStorage({
      
    })
    const fileFilter = (req,file,cb)=>{
        if(acceptType.includes(file.mimetype)){
            cb(null,true);
        } else {
            cb(null,false);
        }
    }
    
    const upload = multer({ dest:'uploads', fileFilter,storage});

    return upload
};