import { Router } from "express";
import { HME, myMulter, validationTypes } from '../../service/multer.js';
import { auth } from '../../middleware/auth.js';
import * as postController from './controller/post.controller.js'

const router = Router();
// add post
router.post('/add', auth(),myMulter(validationTypes.image).single('image'), HME ,postController.addPost)
// update post
router.put('/update/:postId',auth(),postController.updatePost);
// get all posts
router.get('/',auth(),postController.getAllPosts);
// delete post
router.delete('/delete/:postId',auth(),postController.deletePost)
// get user posts
router.get('/userposts',auth(),postController.getUserPosts);
export default router