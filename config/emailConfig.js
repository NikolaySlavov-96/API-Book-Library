const nodemailer = require('nodemailer');
require('dotenv').config();


const generateTransport = async () => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EML_HOST,
            port: process.env.EML_PORT,
            auth: {
                user: process.env.EML_NAME,
                pass: process.env.EML_PASS,
            }
        });
        return transporter;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    generateTransport,
}