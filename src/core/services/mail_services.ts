import * as nodemailer from 'nodemailer';

export class MailServices{

    private readonly mailHostAddress:string = "noreply@haydiekspres.com.tr";

     transporter = nodemailer.createTransport({
        host: 'mail.haydiekspres.com.tr',
        port:465,
        secure:true,
        auth: {
            user: 'noreply@haydiekspres.com.tr',
            pass: 'xu1267*!A'
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

    async sendPaymentErrorMail(message:string):Promise<boolean>{
        try {
            const mailOptions = {
                from: this.mailHostAddress, 
                to:"ocakirsaz@gmail.com", 
                subject: 'Ödeme Hatası',
                text: message,
            };
            
            const info = await this.transporter.sendMail(mailOptions);
    
            return true;
        } catch (error) {
            return false;
        }
    }

    async sendHubAccessCode(code:string):Promise<boolean>{
        try {
            const mailOptions = {
                from: this.mailHostAddress, 
                to:"ocakirsaz@gmail.com.tr", 
                subject: 'Erişim Kodu',
                text: code,
            };
            
            const info = await this.transporter.sendMail(mailOptions);
    
            return true;
        } catch (error) {
            return false;
        }
    }
}