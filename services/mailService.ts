import { EMAIL, } from '../constants';
import { createLink, mailUtil, } from '../util';

const mailTitle = {
    [EMAIL.REGISTER_CONFIRM]: 'Verify Account -> Book',
    [EMAIL.MAGIC_LINK]: 'Sign in link -> Book',
};

const linkCondition = {
    [EMAIL.REGISTER_CONFIRM]: 'verify',
    [EMAIL.MAGIC_LINK]: 'magic',
};


export default async (existingUser, dataForEmail) => {
    const TYPE_OF_EMAIL = dataForEmail[0].type;
    const link = await createLink(existingUser, linkCondition[TYPE_OF_EMAIL]);

    mailUtil(existingUser.email, TYPE_OF_EMAIL, mailTitle[TYPE_OF_EMAIL], { link, });
};