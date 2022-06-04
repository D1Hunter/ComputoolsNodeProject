import { Strategy } from "passport-google-oauth2";
import passport from 'passport';

const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID||'apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET||'secret';
const GOOGLE_CALLBACK_URL=process.env.GOOGLE_CALLBACK_URL||'http://localhost:5000/google/callback';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user:any, done) => done(null, user));

passport.use(new Strategy(
    {
        clientID:GOOGLE_CLIENT_ID,
        clientSecret:GOOGLE_CLIENT_SECRET,
        callbackURL:GOOGLE_CALLBACK_URL,
        passReqToCallback:true
    },
    (request:any,accessToken:any,refreshToken:any,profile:any,done:any)=>{
        return done(null,profile);
    }
));