const { sendEmail } = require('../util/mailUtil');

exports.verifyAccount = (existingUser) => {
  sendEmail(existingUser.email, "configEmail", 'Verify Account -> Book', { link: "Verify Ling"});
};