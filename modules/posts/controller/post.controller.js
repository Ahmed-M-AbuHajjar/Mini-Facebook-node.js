import cloudinary from '../../../service/cloudinary.js';
import { postModel } from '../../../DB/models/post.model.js';
// add post
export const addPost = async (req,res) => {
    try {
    let uploadedImage = await cloudinary.uploader.upload(req.file.path,{
        folder:`user/posts/${req.user._id}`
    })
    let post = new postModel({createdBy:req.user._id,postImage:uploadedImage.secure_url});
    let savedPost = await post.save()
    res.status(201).json({message:'Done',savedPost});
    } catch (error) {
        res.status(500).json({message:'error',error});
    }
};
// update post
export const updatePost = async (req,res) => {
    try {
        let {content} = req.body;
        let {postId} = req.params;
        const updatedPost = await postModel.findByIdAndUpdate(postId,{
            content
        },{new:true});
        res.status(200).json({message:'post update successfully',updatedPost})
    } catch (error) {
        res.status(500).json({message:'error',error})
    }
};
// get all posts
export const getAllPosts = async (req,res) => {
    try {
        const posts = await postModel.find().populate([{
            path:'createdBy',
            select:'userName email'
        }]);
        res.status(200).json({message:'Done',posts});
    } catch (error) {
        res.status(500).json({message:'error',error});
    }
};
// delete post
export const deletePost = async (req,res) => {
    try {
        const {postId} = req.params;
        const findPost = await postModel.findById(postId)
         if(findPost){
           console.log(findPost);
           await postModel.findByIdAndDelete(findPost._id)
            res.status(200).json({message:'post deleted successfully'});
        } else {
            res.status(404).json({message:'no post found with this id'})
         }
        res.json({message:'done'})
        
    } catch (error) {
        res.status(500).json({message:'error',error});
    }
};
// get user posts
export const getUserPosts = async (req,res) => {
    try {
         const userPosts = await postModel.find({createdBy:req.user._id}).populate([{
            path:'createdBy',
            select:'userName email'
         }]); 
         res.status(200).json({message:'Done',userPosts})
    } catch (error) {
        res.status(500).json({message:'error',error})
    }
}