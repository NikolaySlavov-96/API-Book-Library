import 'dotenv/config';

import { emailConfig } from '../config';
import { EMAIL } from '../constants';
import { createLogger } from '../Helpers';
import { magicLinkTemplate, registryTemplate } from '../templates';

const log = createLogger('mailUtil');

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
                email,
                name: '',
            },
        ],
        subject,
        text: '',
        html: templates[condition](data),
    };

    try {
        const sendEmail = emailConfig();
        await sendEmail(mailOptions);
    } catch (error) {
        log.error('sendEmail failed', error);
    }
};
