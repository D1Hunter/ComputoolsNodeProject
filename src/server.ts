import 'dotenv/config';
import '../src/auth/passport_strategy';
import '../src/ws';
import express from "express";
import fileUpload from "express-fileupload";
import {Router} from './routes';
import Sequelize from "./db/instantiate_sequalize";
import session from "express-session";
import passport from "passport";
import sessionStore from "./db/instantiate_session_store";
import path from "path";

const PORT=process.env.PORT||5000;
const SESSION_SECRET=process.env.SESSION_SECRET||'secret';

const app = express();

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
} );

app.get("/echo", (req, res) => {
    res.status(200).send("Server successful started");
  });

app.use(express.static(path.resolve('./', 'image')))

const start=async()=>{
    try{
    await Sequelize.sync();
    await Sequelize.authenticate();
    app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
    } );
    }
    catch(e){
        console.log(e);
    }
}

start();