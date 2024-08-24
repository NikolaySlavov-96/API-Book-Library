interface IMessageType {
    [key: string]: {
        message: string;
        messageCode: string;
    };
};

const messages: IMessageType = {
    // Global
    MESSAGE_AT_ERROR_FROM_SERVER: { message: 'Something went wrong!', messageCode: 'global-0001', },
    INVALID_TOKEN: { message: 'Invalid Token!', messageCode: 'global-0002', },
    EXPIRED_TOKEN: { message: 'Expired token!', messageCode: 'global-0003', },
    VALID_TOKEN: { message: 'Valid Token!', messageCode: 'global-0004', },
    INVALID_AUTHORIZE_TOKEN: { message: 'Invalid authorization token!', messageCode: 'global-0005', },
    LOGIN_EXPIRED: { message: 'Login Expired', messageCode: 'global-0006' },

    // Successfully   
    ACCOUNT_IS_SUCCESSFULLY: { message: 'Account is successfully verified!', messageCode: 'global-0101', },
    SUCCESSFULLY_VERIFY_ACCOUNT: { message: 'Successful Verify', messageCode: 'global-0102', },
    SUCCESSFULLY_LOGIN: { message: 'Successful Login', messageCode: 'global-0103', },
    PLEASE_VISIT_YOU_EMAIL: { message: 'Please visit your Email address', messageCode: 'global-0104', },
    SUCCESSFULLY_REGISTER: { message: 'Successfully register', messageCode: 'global-0105', },

    // User
    EMAIL_DOES_NOT_EXIST: { message: 'Email does not exist!', messageCode: 'user-0001', },
    WRONG_CURRENT_PASSWORDS: { message: 'Wrong current password!', messageCode: 'user-0002', },
    WRONG_EMAIL_OR_PASSWORD: { message: 'Wrong email or password!', messageCode: 'user-0003', },
    EMAIL_IS_ALREADY_TAKEN: { message: 'Email is already taken!', messageCode: 'user-0004', },
    ACCOUNT_ALREADY_TAKEN: { message: 'Account is already verified!', messageCode: 'user-0005', },
    ALL_FIELDS_ARE_REQUIRED: { message: 'All fields are required!', messageCode: 'user-0006', },
    INVALID_USER: { message: 'Invalid user!', messageCode: 'user-0007', },
    DELETED_PROFILE: { message: 'Profile is delete, contact with administrator', messageCode: 'user-0008', },
};

export default messages;