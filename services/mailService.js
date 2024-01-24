require("dotenv").config();
const { sendEmail } = require('../util/mailUtil');


const verifyAccount = (existingUser) => {
    sendEmail(process.env.EML_NAME, existingUser.email, "Register", `<h1>Successfull Register</h1>
    <p>Please confirm Email</p>`);
};

module.exports = {
    verifyAccount,
}