import { createLink, mailUtil, } from '../util';


export default (existingUser) => {
    const verifyLink = createLink(existingUser, 'verify');
    mailUtil(existingUser.email, 'configEmail', 'Verify Account -> Book', { link: verifyLink, });
};