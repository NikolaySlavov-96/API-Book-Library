interface IUserModelInput {
    id: number;
    email: string;
    isVerify: boolean;
    profile?: { year: number } | null;
    year?: number;
}

const userModel = (data: IUserModelInput) => {
    return {
        email: data.email,
        userId: data.id,
        userYear: data.profile?.year ?? data.year,
        userStatus: data.isVerify,
    };
};

export default userModel;
