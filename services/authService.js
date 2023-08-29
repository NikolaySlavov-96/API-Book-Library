const jwt = require('jsonwebtoken');


const JWT_SECRET = '2222334';



async function verificationToken(token) {
    return jwt.verify(token, JWT_SECRET);
}


module.exports = {
    verificationToken,
}