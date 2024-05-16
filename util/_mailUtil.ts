import 'dotenv/config';

import { emailConfig, } from '../config';
import { registryTemplate, } from '../templates';
import { email, } from '../constants';


const templates = {
    [email.REGISTER_CONFIRM]: (data) => registryTemplate(data),
};


export default async (email, condition, subject, data) => {

    const mailOptions = {
        Messages: [
            {
                From: {
                    Email: process.env.MAILJET_EMAIL,
                    Name: 'Book Library',
                },
                To: [
                    {
                        Email: email,
                        Name: 'passenger 1',
                    }
                ],
                Subject: subject,
                TextPart: '',
                HTMLPart: templates[condition](data),
            }
        ],
    };

    try {
        const transport = await emailConfig();
        const result = await transport
            .post('send', { version: 'v3.1', })
            .request(mailOptions);
        return result;
    } catch (error) {
        console.log(error);
    }
};