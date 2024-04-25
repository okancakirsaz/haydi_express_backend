import * as nodemailer from 'nodemailer';

export class MailServices{
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
                from: 'example@gmail.com', 
                to: mailAddress, 
                subject: 'Şifre Sıfırlama İsteği',
                //TODO:Change url after release website
                text: `http://localhost:5173/reset-password?uid=${uid}`
            };
    
            
            const info = await this.transporter.sendMail(mailOptions);
    
            console.log('E-posta gönderildi:', info.response);
            return true;
        } catch (error) {
            console.error('E-posta gönderilirken hata oluştu:', error);
            return false;
        }
    }
}