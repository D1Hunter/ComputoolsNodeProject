import express from "express";
import session from "express-session";
import path from "path";
import fileUpload from "express-fileupload";
import passport from "passport";
import sessionStore from "./db/instantiate_session_store";
import { Router } from './routes';

const SESSION_SECRET=process.env.SESSION_SECRET||'secret';
const IMAGE_FOLDER_PATH = process.env.IMAGE_FOLDER_PATH||'image';

export const app = express();

app.use(session({
    secret:SESSION_SECRET,
    store:sessionStore,
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24
    }
}));

app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api',Router);

app.get( "/", ( req, res ) => {
    res.send(
    '<a href="/api/auth/google">Auth with Google</a>' );
});

app.get("/echo", (req, res) => {
    res.status(200).send("Server successful started");
});

app.use(express.static(path.resolve(IMAGE_FOLDER_PATH)));