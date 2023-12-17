import {userModel} from '../../../DB/models/user.model.js'
import bcryptjs from 'bcryptjs'
import { postModel } from '../../../DB/models/post.model.js';
import cloudinary from '../../../service/cloudinary.js';
// change password
export const updatePassword = async (req,res) => {
    try {
        const {currentPassword,newPassword,newCPassword} = req.body;
        if(newPassword == newCPassword){
            const foundedUser = await userModel.findById(req.user.id);
            let matched = await bcryptjs.compare(currentPassword,foundedUser.password);
            if(matched){
                let hashed = await bcryptjs.hash(newPassword, parseInt(process.env.saltRound));
                let updatedUser = await userModel.findByIdAndUpdate(foundedUser._id,{password:hashed},{new:true});
                res.status(200).json({message:'user Updated Successfully',updatedUser})
            } else {
                res.status(400).json({message:'Invalid Current Password'});
            }
        } else {
            res.status(400).json({message:'newPassword not matching newCPassword'});
        }
    } catch (error) {
     res.status(500).json({message:'error',error});
    }
};
// delete user
export const deleteUser = async (req,res) => {
    try {
        const foundedUser = await userModel.findById(req.user.id);
    if(foundedUser){
        if(foundedUser.isConfirmed == true){
            await userModel.findByIdAndDelete(foundedUser._id);
            res.status(200).json({message:'user deleted successfully'});
        } else {
            res.status(400).json({message:'cannot delete user without being confirmed'});
        }
    } else {
        res.status(404).json({message:'token error, user not found!'});
    }
    } catch (error) {
        res.status(500).json({message:'error',error});
    }
};
// get all users
export const getAllUsers = async (req,res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({message:'Done',users})
    } catch (error) {
        res.status(500).json({message:'error',error})
    }
};
// get specific user
export const getUser = async (req,res) => {
    try {
        const userPosts = await postModel.find({createdBy:req.user._id}).populate([{
            path:"createdBy",
            select:"name email"
        }])
        res.status(200).json({message:'Done',userPosts})
    } catch (error) {
        res.status(500).json({message:'error',error});
    }
}
// add profile pic
export const profilepic = async (req,res) => {
    try {
            if(!req.file){
                res.status(400).json({message:'Please upload image'});
            } else { 
                let uploadedImg = await cloudinary.uploader.upload(req.file.path,{
                    folder:`user/${req.user._id}`
                })
                await userModel.updateOne({_id:req.user._id},{
                    profilePic:uploadedImg.secure_url
                },{new:true})
                res.status(200).json({message:'Done' })
            }
           
        
    } catch (error) {
        res.status(500).json({message:'error',error})
    }

};
// add cover pic
export const coverPic = async (req,res) => {
    try {
        if(!req.files){
            res.status(400).json({message:'Please upload images'})
        } else {
            let imgs = []
            for(const file of req.files){
                let uploadedimgs = await cloudinary.uploader.upload(file.path,{folder:`cover`})
                console.log(uploadedimgs);
                imgs.push(uploadedimgs.secure_url)
                 await userModel.updateOne({_id:req.user._id},{coverPic:imgs})
            }    
            res.status(200).json({message:'Done',userModel});
        }
    } catch (error) {
     res.status(500).json({message:'error',error})   
    }  
};