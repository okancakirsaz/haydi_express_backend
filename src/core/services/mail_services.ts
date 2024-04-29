import * as nodemailer from 'nodemailer';

export class MailServices{

    private readonly mailHostAddress:string = "ocairsaz@gmail.com";

     transporter = nodemailer.createTransport({
        service:"Gmail",
        host: 'smtp.gmail.com',
        port:465,
        secure:true,
        auth: {
            //TODO:Change it
            user: 'ocairsaz@gmail.com',
            pass: 'thqh bljg micl oyxh'
        }
    });


    async sendResetPasswordMail(mailAddress:string,uid:string):Promise<boolean>{
        try {
            
            const mailOptions = {
                from: this.mailHostAddress, 
                to: mailAddress, 
                subject: 'Şifre Sıfırlama İsteği',
                //TODO:Change url after release website
                text: `http://localhost:5173/reset-password?uid=${uid}`
            };
    
            
            const info = await this.transporter.sendMail(mailOptions);
    
            return true;
        } catch (error) {
            return false;
        }
    }


    async sendVerificationCode(mailAddress:string,activationCode:string):Promise<boolean>{
        try {

            
            
            const mailOptions = {
                from: this.mailHostAddress, 
                to: mailAddress, 
                subject: 'Mail Doğrulama Kodu',
                //TODO:Change url after release website
                text: activationCode
            };
    
            
            const info = await this.transporter.sendMail(mailOptions);
    
            return true;
        } catch (error) {
            return false;
        }
    }
}