import express from "express";
import { check } from 'express-validator';
import passport from "passport";
import authController from "./auth_controller";

export const AuthRouter=express();

//POST
AuthRouter.post('/register',[
    check('email','Wrong email').isString().isEmail(),
    check('password','Password must be longer than 4 and less than 12 characters').isString().isLength({min:4,max:12}),
    check('login','Login must be longer than 4 and less than 16 characters').isString().isLength({min:4,max:16}),
    check('firstName','First name must be longer than 4 and less than 30 characters').isString().isLength({min:4,max:30}),
    check('secondName','Second name must be longer than 4 and less than 30 characters').isString().isLength({min:4,max:30})
],authController.registration)

AuthRouter.post('/login',[
    check('email','Wrong email').isString().isEmail(),
    check('password','Password must be longer than 4 and less than 12 characters').isString().isLength({min:4,max:12})
],authController.login)

AuthRouter.post('/forgot-pass',[
    check('email',"Wrong email").isString().isEmail()
],authController.forgotPass)

AuthRouter.post('/reset-pass/:link',[
    check('password','Password must be longer than 4 and less than 12 characters').isString().isLength({min:4,max:12})
],authController.resetPass);

//GET
AuthRouter.get('/google',passport.authenticate('google',{scope:['email','profile']}));

AuthRouter.get('/google/callback',
    passport.authenticate('google',{
        successRedirect:'/api/auth/google/success',
        failureMessage:'/api/auth/google/failure'
    })
);

AuthRouter.get('/google/success',authController.successGoogleAuth);

AuthRouter.get('/google/failure',authController.failureGoogleAuth);

AuthRouter.get('/google/logout',authController.logoutGoogle);