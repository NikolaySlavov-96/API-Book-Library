const { generateTransport } = require("../config/emailConfig");


const sendEmail = async (from, to, subject, html) => {

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: ``,
        html: html,
    };

    console.log(mailOptions)


    try {
        const transport = await generateTransport();
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmail,
}