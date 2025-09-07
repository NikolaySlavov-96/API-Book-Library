import 'dotenv/config';
import mailjet from 'node-mailjet';
import { createTransport, } from 'nodemailer';


const {
    MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, MAILJET_EMAIL,
    SMTP_EMAIL, SMTP_USER, SMTP_PASSWORD, SMTP_PORT, SMTP_HOST,
} = process.env;

const mailjetConnection = () => {
    return mailjet.apiConnect(
        MJ_APIKEY_PUBLIC,
        MJ_APIKEY_PRIVATE
    );
};

const mailjetMessageBuilder = (config) => {
    const messageConfig = {
        Messages: [
            {
                From: {
                    Email: MAILJET_EMAIL,
                    Name: config.from.name,
                },
                To: config.to,
                Subject: config.subject,
                TextPart: config.text,
                HTMLPart: config.html,
            }
        ],
    };
    return mailjetConnection().post('sent', { version: 'v3.1', }).request(messageConfig);
};

const sentWithNodemailer = () => {
    const isSecureStatus = Number(SMTP_PORT) === 465;

    return createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: isSecureStatus,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });
};

const nodemailerMessageBuilder = (config) => {
    const constructTo = config.to
        .filter(t => t.email && t.email.trim())
        .map(t => t.email)
        .join(', ');

    const messageConfig = {
        from: SMTP_EMAIL,
        to: constructTo,
        subject: config.subject,
        text: config.text,
        html: config.html,
    };

    return sentWithNodemailer().sendMail(messageConfig);
};


const sendEmail = (provider?: 'nodemailer' | 'mailjet') => {
    if (provider === 'mailjet') {
        return mailjetMessageBuilder;
    }

    return nodemailerMessageBuilder;
};

export default sendEmail;