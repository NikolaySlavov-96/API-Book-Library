require('dotenv').config();
const mailjet = require('node-mailjet')


exports.mailJetFunc = () => {
  return mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  )
}