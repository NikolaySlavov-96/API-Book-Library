const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbConnect } = require('../config/database');

require('dotenv').config();

const JWT_Secret = process.env.JWT_SECRES;
// const JWT_Secret = '2222334';

// change password
// BlackListTokenModel

async function register(query, param) {
    const existingEmail = await dbConnect.query(query.check, param.check)
    if (existingEmail.rows.length) {
        throw new Error('Email is taken');
    }
    const hashedPassword = await hashPassword(param.register[1])
    param.register[1] = hashedPassword;
    const result = await dbConnect.query(query.register, param.register);
    return createTokent(result.rows[0]);
}

async function login(query, param, body) {

    const existingEmail = await dbConnect.query(query, param);
    
    if (existingEmail.isDelete) {
        throw new Error('Profile is delete, contact with administrate');
    }

    if (!existingEmail.rows.length) {
        throw new Error('Email or Password is not valit');
    }
    
    const { stayLogin, password } = body;
    const matchPassword = await bcrypt.compare(password, existingEmail.rows[0].password);

    if (!matchPassword) {
        throw new Error('Email or Password is not valit')
    }
    return createTokent(existingEmail.rows[0], stayLogin);
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

async function checkFieldInDB(query, param) {
    const isUsing = await dbConnect.query(query, param);
    return isUsing;
}

const hashPassword = async (password) => await bcrypt.hash(password, 10);

module.exports = {
    register,
    login,
    logout,
    verificationToken,
    checkFieldInDB,
}