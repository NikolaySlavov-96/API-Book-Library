import 'dotenv/config';

import { emailConfig, } from '../config';
import { registryTemplate, } from '../templates';
import { EMAIL, } from '../constants';


const templates = {
    [EMAIL.REGISTER_CONFIRM]: (data) => registryTemplate(data),
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