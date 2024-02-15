const { createLink } = require('../util/createLink');
const { sendEmail } = require('../util/mailUtil');

exports.verifyAccount = (existingUser) => {
  const verifyLink = createLink(existingUser, "verify");
  sendEmail(existingUser.email, "configEmail", 'Verify Account -> Book', { link: verifyLink});
};