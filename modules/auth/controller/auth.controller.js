import { userModel } from '../../../DB/models/user.model.js';
import bycryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../../service/sendEmail.js';
import { nanoid } from "nanoid";
// sign up
export const signUp = async (req, res) => {
    try {
        const { userName, email, password, cPassword} = req.body;
        const foundedUser = await userModel.findOne({ email });
        if (password == cPassword) {
            if (foundedUser) {
                res.status(400).json({ message: "user already registered" });
            } else {
                let hashed = await bycryptjs.hash(password, parseInt(process.env.saltRound));
                let user = new userModel({ userName, email, password: hashed});
                let savedUser = await user.save();
                let token = jwt.sign({ id: savedUser._id }, process.env.JWTKEY, { expiresIn: 60 })
                let URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirm/${token}`
                let refreshToken = jwt.sign({ id: savedUser._id }, process.env.JWTKEY, { expiresIn: 60* 60 });
                let message = `<h3>thank you for registering please click the link below to activate your account</h3><br><a href='${URL}'>click here to verify</a>
                <br>
                <br>
                <a href="${req.protocol}://${req.headers.host}/api/v1/auth/refreshToken/${refreshToken}">please click to refreshToken</a>`
                await sendEmail(email, message)
                res.status(201).json({ message: "Done", savedUser });
            }
        } else {
            res.status(400).json({ message: "Password not matching cPassword" });
        }
    } catch (error) {
        res.status(500).json({ message: 'error', error })
    }
};
// sign in
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundedUser = await userModel.findOne({ email });

        if (foundedUser) {
            if (foundedUser.isConfirmed) {
                let matched = await bycryptjs.compare(password, foundedUser.password);
                if (matched) {
                    let token = jwt.sign({ isLogin: true, id: foundedUser._id }, process.env.JWTKEY)
                    res.status(200).json({ message: 'welcome', foundedUser, token });
                } else {
                    res.statua(400).json({ message: 'Invalid password' });
                }
            } else {
                res.status(400).json({ message: 'you have to verify your email first' })
            }

        } else {
            res.status(404).json({ message: "user not registered or uncofirmed email" });
        }

    } catch (error) {
        res.status(500).json({ message: 'error', error });
    }
};
// confirm email
export const confirmEmail = async (req, res) => {
    try {
        let { token } = req.params;
        if (token == undefined || token == null || !token) {
            res.status(404).json({ message: "token error, user not found!" });
        } else {
            let decoded = jwt.verify(token, process.env.JWTKEY)
            if (decoded) {
                let { id } = decoded;
                let foundedUser = await userModel.findById(id);
                if (foundedUser) {
                    if (foundedUser.isConfirmed) {
                        res.status(400).json({ message: 'email already confirmed' });
                    } else {
                        let updateUser = await userModel.findByIdAndUpdate(foundedUser.id, { isConfirmed: true }, { new: true })
                        res.status(200).json({ message: 'email confirmed successfully'})
                    }
                } else {
                    res.status(404).json({ message: 'no user found with this email!' });
                }
            } else {
                res.status(404).json({ message: 'token error, user not found!' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'error', error })
    }

};
// refresh token
export const refreshToken = async (req, res) => {
    try {
        let { token } = req.params;
        if (token == undefined || token == null || !token) {
            res.status(404).json({ message: "token error, user not found!" });
        } else {
            let decoded = jwt.verify(token, process.env.JWTKEY)
            if (decoded) {
                let { id } = decoded;
                let foundedUser = await userModel.findById(id);
                if (foundedUser) {
                    if (foundedUser.isConfirmed) {
                        res.status(400).json({ message: 'email already confirmed' });
                    } else {
                        let token = jwt.sign({ id: foundedUser._id }, process.env.JWTKEY);
                        let message = `<a href="${req.protocol}://${req.headers.host}/api/v1/auth/confirm/${token}">this is the second email</a>`;
                        sendEmail(foundedUser.email, message);
                        res.status(200).json({ message: "Done please check you email" });
                    }
                } else {
                    res.status(404).json({ message: 'no user found with this email!' });
                }
            } else {
                res.status(404).json({ message: 'token error, no user found!' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'error', error })
    }
};
// forget password
// sending code to email to rest password
export const sendCode = async (req, res) => {
    try {
        let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({message:"no user found with this email!"})
    } else {
      let OTPCode = nanoid()
        await userModel.findByIdAndUpdate(user._id,{code:OTPCode})
        let message = `your OTPCODE is ${OTPCode}`;
        sendEmail(user.email, message);
        res.status(200).json({ message: "Done please check you email" });
  
    }
    } catch (error) {
        res.status(500).json({message:'error',error})
    }
  };

  export const forgetPassword = async (req, res) => {
    try {
      let { code, email, password } = req.body;
      if (!code) {
        res.status(400).json({ message: "code is not valid" });
      } else {
        let user = await userModel.findOne({ email, code });
        if (!user) {
          res.status(400).json({ message: "email or code is not valid" });
        } else {
          const hashPass = await bycryptjs.hash(password, parseInt(process.env.saltRound));
          let update = await userModel.findByIdAndUpdate(user._id, { code: null, password: hashPass }, { new: true });
          res.status(200).json({ message: "success", update });
        }
      }
    } catch (error) {
          res.status(500).json({ message: "error", error });
    }
    
  };
  