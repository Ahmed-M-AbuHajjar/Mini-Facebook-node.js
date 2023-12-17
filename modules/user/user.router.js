import {Router} from 'express';
const router = Router();
import {deleteUserSchema, updatePasswordSchema,getSpecificUserSchema} from './user.validation.js'
import { validation } from '../../middleware/validation.js'
import {auth} from '../../middleware/auth.js'
import * as userController from './controller/user.controller.js'
import { HME, myMulter, validationTypes } from '../../service/multer.js';
// change password
router.patch('/updatepassword',auth(), validation(updatePasswordSchema) ,userController.updatePassword);
// delete password
router.delete('/deleteuser',auth(),validation(deleteUserSchema),userController.deleteUser);
// get all users
router.get('/',auth(),userController.getAllUsers);
// get specific user
router.get('/profile',auth(),validation(getSpecificUserSchema),userController.getUser);
// upload profile picture
router.get('/profilepic',auth(),myMulter(validationTypes.image).single('image'),HME,userController.profilepic);
// upload cover picture
router.get('/coverPic',auth(),myMulter(validationTypes.image).array('image',5),HME,userController.coverPic);
export default router;