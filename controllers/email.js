import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
// dotenv.config({
//     path:'E:/project/Dexter/eMenuFi-main/backend/config/config.env'
// })
dotenv.config({
    path:'../config/config.env'
})
class SendemailContoroller{
static sendmail = async (req, res) => {
    // req.body
    try {
        // console.log(req.body)
        const  {email} = req.body;
        const  {file} = req.body;
        const transporter = nodemailer.createTransport({
            service:process.env.SMPT_SERVICE,
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure: true,
            auth:{
                user:process.env.SMTP_MAIL,
                pass:process.env.SMTP_PASSWORD
            }
        });

        transporter.sendMail({
            from:"mubbashirahmad44@gmail.com",
            to: email,
            subject: "Your E-Menue ",
            text: "Hi, Your e-menu for singing is attached below.",
            attachments: [{ path: file }]
        });
        res.status(201).send({ message: "Email sent sucessfully!" })
    } catch (error) {
        console.log("email sent sucessfully: %s", error,);
        res.status(404).send({ message: "Error! Please Try Again" })
    }
}



static sendEmail =async(options)=>{
    console.log(process.env.SMTP_SERVICE)
    const transporter = nodemailer.createTransport({
        service:process.env.SMPT_SERVICE,
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }
    })
    const mailOption={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    await transporter.sendMail(mailOption)
}


}
export default SendemailContoroller
