// REGEX PASSWORD PATTER
export const PASSWORD_PATTERN = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/;

// !!!! Only variables with string !!!!
// ROUTING

const routing = {
    ALL_FIELD_IS_REQUIRE: 'All fields is required!',
    AUTHOR_REQUIRED: 'Author is required',
    PRODUCT_GENRE: 'Genre is required filed',
    EMAIL_ADDRESS_INCORRECT: 'Email address is not correct',
    EMAIL_IS_REQUIRED: 'Email address is required',
    FILE_NAME: 'src name is max 145 characters',
    INCORRECT_INPUT_DATE: 'Incorrect input data',
    INCORRECT_TYPE_PASSWORD: 'Incorrect type of password',
    INVALID_EMAIL: 'Invalid email',
    INVALID_PASSWORD: 'Invalid password',
    PASSWORD_IS_REQUIRED: 'Password is required',
    TOKE_IS_REQUIRED: 'Verify token is required',
    YEARS_IS_REQUIRED: 'Years is requited',
    PRODUCT_TITLE_REQUIRED: 'Product title is required',
    PRODUCT_FIELD_ID: 'Field Id must be a required',
    PRODUCT_ID_IS_REQUIRED: 'Product ID is required',
    PRODUCT_COLLECTION_TYPE: 'Please insert correct collection type',
};

export default routing;