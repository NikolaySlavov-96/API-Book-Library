import { EMAIL } from '../constants';
import { createLink, mailUtil, } from '../util';

const mailTitle = {};
mailTitle[EMAIL.REGISTER_CONFIRM] = 'Verify Account -> Book';


export default (existingUser, dataForEmail) => {
    const TYPE_OF_EMAIL = dataForEmail[0].type;
    const verifyLink = createLink(existingUser, 'verify');

    mailUtil(existingUser.email, TYPE_OF_EMAIL, mailTitle[TYPE_OF_EMAIL], { link: verifyLink, });
};