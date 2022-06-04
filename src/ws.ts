import {Server} from "ws";

const WS_PORT:number=Number(process.env.WS_PORT)||5500;

const wss=new Server({port:WS_PORT})

module.exports=wss.on("connection",(ws)=>{
    console.log("client connected")
    ws.on("close",()=>{console.log("client disconected")})
})
