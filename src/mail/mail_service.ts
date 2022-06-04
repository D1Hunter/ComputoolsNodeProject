import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || 'Host';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER || 'User';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || 'Password';

class MailService{
    transporter
    constructor(){
        this.transporter=nodemailer.createTransport({
            host:SMTP_HOST,
            port:Number(SMTP_PORT),
            secure:false,
            auth:{
                user:SMTP_USER,
                pass:SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to:string,link:string):Promise<void>{
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:"Password recovery",
            text:'',
            html:`<div>
            <h1>To activate follow the link</h1>
            <a href="${link}">${link}</a>
            </div>`
        })
    }
}

export default new MailService();