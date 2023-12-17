import {Router} from 'express';
const router = Router();

import { validation } from '../../middleware/validation.js'
import { signUpSchema } from './auth.validation.js'
import * as authController from './controller/auth.controller.js'
// sign up
router.post('/signup', validation(signUpSchema),authController.signUp);
// sign in
router.post('/signin', authController.signIn);
// confirm email
router.get('/confirm/:token', authController.confirmEmail);
// refresh token
router.get('/refreshToken/:token', authController.refreshToken);
// forget Password
router.post('/sendCode', authController.sendCode);
router.post('/forgetPassword',authController.forgetPassword);

export default router;