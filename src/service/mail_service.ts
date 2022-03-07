require('dotenv').config();
import nodemailer from "nodemailer";
class MailService{
    transporter
    constructor(){
        this.transporter=nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:Number(process.env.SMTP_PORT),
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })
    }

    sendActivationMail(to:string,link:string){
        this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:"Password recovery"+process.env.API_URL,
            text:'',
            html:`<div>
            <h1>To activate follow the link</h1>
            <a href="${link}">${link}</a>
            </div>`
        })
    }
}

export default new MailService();