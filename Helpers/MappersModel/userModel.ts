const userModel = (data) => {
    return {
        email: data.email,
        userId: data.id,
        userYear: data?.profile?.year ?? data?.year,
        userStatus: data.isVerify,
    };
};

export default userModel;
