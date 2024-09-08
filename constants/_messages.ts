interface IMessageType {
    [key: string]: {
        message: string;
        messageCode: string;
    };
}

const messages: IMessageType = {
    // Global
    MESSAGE_AT_ERROR_FROM_SERVER: { message: 'Something went wrong!', messageCode: 'global-0001', },

    // User
    INVALID_TOKEN: { message: 'Invalid Token!', messageCode: 'user-0001', },
    EXPIRED_TOKEN: { message: 'Expired token!', messageCode: 'user-0002', },
    VALID_TOKEN: { message: 'Valid Token!', messageCode: 'user-0003', },
    INVALID_AUTHORIZE_TOKEN: { message: 'Invalid authorization token!', messageCode: 'user-0004', },
    LOGIN_EXPIRED: { message: 'Login Expired', messageCode: 'user-0005', },
    PLEASE_LOGIN: { message: 'Please login', messageCode: 'user-0006', },
    SUCCESSFULLY_VERIFY_ACCOUNT: { message: 'Successful Verify', messageCode: 'user-0007', },
    SUCCESSFULLY_LOGIN: { message: 'Successful Login', messageCode: 'user-0008', },
    PLEASE_VISIT_YOU_EMAIL: { message: 'Please visit your Email address', messageCode: 'user-0009', },
    SUCCESSFULLY_REGISTER: { message: 'Successfully register', messageCode: 'user-0010', },
    ACCOUNT_IS_SUCCESSFULLY: { message: 'Account is successfully verified!', messageCode: 'user-0011', },
    EMAIL_DOES_NOT_EXIST: { message: 'Email does not exist!', messageCode: 'user-0012', },
    WRONG_CURRENT_PASSWORDS: { message: 'Wrong current password!', messageCode: 'user-0013', },
    WRONG_EMAIL_OR_PASSWORD: { message: 'Wrong email or password!', messageCode: 'user-0014', },
    EMAIL_IS_ALREADY_TAKEN: { message: 'Email is already taken!', messageCode: 'user-0015', },
    ACCOUNT_ALREADY_TAKEN: { message: 'Account is already verified!', messageCode: 'user-0016', },
    ALL_FIELDS_ARE_REQUIRED: { message: 'All fields are required!', messageCode: 'user-0017', },
    INVALID_USER: { message: 'Invalid user!', messageCode: 'user-0018', },
    DELETED_PROFILE: { message: 'Profile is delete, contact with administrator', messageCode: 'user-0019', },
    ACCOUNT_IS_NOT_VERIFY: { message: 'Your account is not Verify', messageCode: 'user-0020', },

    // Book
    BOOK_ALREADY_EXIST: { message: 'The book has already been added', messageCode: 'book-0001', },
    SUCCESSFULLY_ADDED_BOOK: { message: 'Successfully added book', messageCode: 'book-0002', },
    SUCCESSFULLY_ADDED_BOOK_IN_COLLECTION: {
        message: 'Successfully added book in your collection', messageCode: 'book-0003',
    },
};

export default messages;