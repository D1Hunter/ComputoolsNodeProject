import 'dotenv/config';
import './auth/passport_strategy';
import './ws';
import { app } from './app';
import dbInstance from "./db/instantiate_sequalize";
import sessionStore from './db/instantiate_session_store';

const PORT = process.env.PORT||5000;

const start=async()=>{
    try{
        await dbInstance.authenticate();
        await sessionStore.sync();
        app.listen( PORT, () => {
            console.log( `server started at http://localhost:${ PORT }` );
        });
    }
    catch(e){
        console.log(e);
    }
}

start();