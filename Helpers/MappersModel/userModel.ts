const userModel = (data) => {
    return {
        email: data.email,
        userId: data.id,
        userYear: data?.year,
        userStatus: data.isVerify,
    };
};

export default userModel;