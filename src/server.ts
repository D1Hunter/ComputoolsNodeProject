import express from "express";
import {Server} from "ws";
const app = express();
const PORT=5000
const WS_PORT=5500
const wss=new Server({port:WS_PORT})

wss.on("connection",(ws)=>{
    console.log("client connected")
    ws.on("close",()=>{console.log("client disconected")})
})

app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

const start=()=>{
    app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
    } );
}

start();