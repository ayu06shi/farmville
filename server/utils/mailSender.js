const nodemailer = require('nodmailer');

const mailSender = async(email, title, body) => {
    try {
        // we create a transporter function using createTransport method
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pwd: process.env.MAIL_PWD,
            }
        })

        let info = await transporter.sendMail({
            from: 'FarmVill',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(info);

        return info;

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender;