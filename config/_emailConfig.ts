import 'dotenv/config';
import mailjet from 'node-mailjet';


export default () => {
    return mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE
    );
};