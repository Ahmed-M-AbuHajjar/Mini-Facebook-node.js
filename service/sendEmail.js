import nodemailer from 'nodemailer';

export const sendEmail = async (dest,message) => {

    let transporter = nodemailer.createTransport({
        service:'gmail',
        port: 587,
        secure:false,
        auth:{
            user:process.env.SenderEmail,
            pass:process.env.SenderPassword,
        },
    });

    let info = await transporter.sendMail({
        from: `${process.env.SenderEmail}`,
        subject:'Activate your account',
        to: dest,
        text:'hello world',
        html:message,
    });
};