const userModel = (data) => {
    return {
        email: data.email,
        userId: data.id,
        // `year` lives on the profile now; fall back to a flat `year` if provided
        userYear: data?.profile?.year ?? data?.year,
        userStatus: data.isVerify,
    };
};

export default userModel;
