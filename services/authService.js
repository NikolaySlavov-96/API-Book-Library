require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../Model/UserModel');


const JWT_Secret = process.env.JWT_SECRES;

// change password
// BlackListTokenModel

async function register(query) {
    query.email = query.email.toLowerCase();
    const existingEmail = await User.findOne({ where: { email: query.email } });

    if (existingEmail) {
        throw new Error('Email is taken');
    }
    const hashedPassword = await hashPassword(query.password);

    const result = await User.create({
        email: query.email,
        password: hashedPassword,
        year: query.year,
    });
    return createTokent(JSON.stringify(result, null, 4));
}

async function login(body) {
    const existingEmail = await User.findOne({ where: { email: body.email } })
    
    if (!existingEmail) {
        throw new Error('Email or Password is not valit');
    }
    const string = existingEmail
    if (string.isDelete) {
        throw new Error('Profile is delete, contact with administrate');
    }

    const { stayLogin, password } = body;
    const matchPassword = await bcrypt.compare(password, string.password);

    if (!matchPassword) {
        throw new Error('Email or Password is not valit')
    }

    return createTokent(string, stayLogin);
}

async function logout(token) {
    console.log(token);
    // const request = await BlackListTokenModel.create({
    // inActivateToken: token,
    // });
    return ('Success logout');
}

function createTokent({ id, email, year }, stayLogin) {
    const payload = {
        id,
        email,
        year
    }

    let expire = '12h'
    if (stayLogin) {
        expire = '29d'
    }

    return {
        id,
        email,
        year,
        accessToken: jwt.sign(payload, JWT_Secret, { expiresIn: expire }),
    }
}

async function verificationToken(token) {
    return jwt.verify(token, JWT_Secret);
}

async function checkFieldInDB(email) {
    const existingEmail = await User.findAndCountAll({ where: { email } });
    return existingEmail.rows.length ? true : false;
}

const hashPassword = async (password) => await bcrypt.hash(password, 10);

module.exports = {
    register,
    login,
    logout,
    verificationToken,
    checkFieldInDB,
}