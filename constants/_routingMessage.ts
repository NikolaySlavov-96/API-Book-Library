// REGEX PASSWORD PATTER
export const PASSWORD_PATTERN = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/;

// !!!! Only variables with string !!!!
// ROUTING

const routing = {
    EMAIL_IS_REQUIRED: 'Email address is required',
    EMAIL_ADDRESS_INCORRECT: 'Email address is not correct',
    PASSWORD_IS_REQUIRED: 'Password is required',
    ALL_FIELD_IS_REQUIRE: 'All fields is required!',
    INVALID_EMAIL: 'Invalid email',
    INVALID_PASSWORD: 'Invalid password',
    INCORRECT_TYPE_PASSWORD: 'Incorrect type of password',
    YEARS_IS_REQUIRED: 'Years is requited',
    TOKE_IS_REQUIRED: 'Verify token is required',
    INCORRECT_INPUT_DATE: 'Incorrect input data',
    BOOK_TITLE_REQUIRED: 'Book title is required',
    AUTHOR_REQUIRED: 'Author is required',
    BOOK_ID_IS_REQUIRED: 'Book ID is required',
    BOOK_COLLECTION_TYPE: 'Please insert correct collection type',
    FILE_NAME: 'src name is max 145 characters',
};

export default routing;