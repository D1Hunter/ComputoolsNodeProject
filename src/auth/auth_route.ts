import express from "express";
import authController from "./auth_controller";
import {check} from 'express-validator'
import passport from "passport";
const authMiddleware = require('../middleware/auth_middleware');

const controller= authController;
const Router=express();

Router.post('/register',[check('email',"Email field cannot be empty").isEmail(),
check('password',"Password must be longer than 4 and less than 12 characters").isLength({min:4,max:12})],controller.registration)

Router.post('/login',[check('email',"Email field cannot be empty").isEmail(),
check('password',"Password must be longer than 4 and less than 12 characters").isLength({min:4,max:12})],controller.login)

Router.post('/forgot-pass',[check('email',"Email field cannot be empty").isEmail()],controller.forgotPass)

Router.post('/reset-pass/:link',controller.resetPass);
Router.get('/users',authMiddleware,controller.getUsers);

Router.get('/google',passport.authenticate('google',{scope:['email','profile']}));

Router.get('/google/callback',
    passport.authenticate('google',{
        successRedirect:'/auth/google/success',
        failureMessage:'/auth/google/failure'
    })    
);
Router.get('/google/success',controller.successGoogleAuth);

Router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate');
  });

export default module.exports=Router;