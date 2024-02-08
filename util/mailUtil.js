require("dotenv").config();

const { mailJetFunc } = require("../config/emailConfig");
const { confirmRegister } = require("../templates/registryTemplate");


const templates = {
  "configEmail": (data) => confirmRegister(data),
}


const sendEmail = async (email, condition, subject, data,) => {

  const mailOptions = {
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_EMAIL,
          Name: "Book Library"
        },
        To: [
          {
            Email: email,
            Name: "passenger 1"
          }
        ],
        Subject: subject,
        TextPart: '',
        HTMLPart: templates[condition](data),
      }
    ]
  }

  console.log(mailOptions)


  try {
    const transport = await mailJetFunc();
    const result = await transport
      .post('send', { version: 'v3.1' })
      .request(mailOptions);
    return result;
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendEmail,
}