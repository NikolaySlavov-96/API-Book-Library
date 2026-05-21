import 'dotenv/config';

import { emailConfig, } from '../config';
import { registryTemplate, magicLinkTemplate, } from '../templates';
import { EMAIL, } from '../constants';


const templates = {
    [EMAIL.REGISTER_CONFIRM]: (data) => registryTemplate(data),
    [EMAIL.MAGIC_LINK]: (data) => magicLinkTemplate(data),
};


export default async (email, condition, subject, data) => {

    const mailOptions = {
        from: {
            name: 'Book Library',
        },
        to: [
            {
                email: email,
                name: '',
            }
        ],
        subject,
        text: '',
        html: templates[condition](data),
    };

    try {
        const sendEmail = emailConfig();
        await sendEmail(mailOptions);

    } catch (error) {
        console.log(error);
    }
};