require('dotenv').config();
require('./passport_strategy');
import express from "express";
import {Server} from "ws";
import authRoute from "./auth/auth_route"
import Sequelize from "./database/instantiate_sequalize";
import session from "express-session";
import passport from "passport";
import sessionStore from "./database/instantiate_session_store";

const PORT=process.env.PORT||5000;
const WS_PORT:number=Number(process.env.WS_PORT)||5500;
const SESSION_SECRET=process.env.SESSION_SECRET||'secret';

const app = express();
const wss=new Server({port:WS_PORT})

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
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth",authRoute);

wss.on("connection",(ws)=>{
    console.log("client connected")
    ws.on("close",()=>{console.log("client disconected")})
})

app.get( "/", ( req, res ) => {
    res.send(
    '<a href="/auth/google">Auth with Google</a>' );
} );

app.get("/echo", (req, res) => {
    res.status(200).send("Server successful started");
  });

const start=async()=>{
    try{
    await Sequelize.authenticate()
    app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
    } );
    }
    catch(e){
        console.log(e);
    }
}

start();