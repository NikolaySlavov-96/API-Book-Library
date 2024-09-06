interface IMessage {
    message: string;
    messageCode?: string;
}
interface IuserInfo extends IMessage {
    userInfo: object;
}

interface IUpdateMessage {
    user: IuserInfo;
    statusCode?: number;
    options?: object
}

export default (messages: IMessage, statusCode?: number, options?: object): IUpdateMessage => {
    const { message, messageCode, } = messages;

    const data = {
        user: {
            userInfo: {},
            message,
            messageCode,
        },
        statusCode,
    };

    // Modifies userInfo with incoming Type
    options !== undefined && (data.user.userInfo = options);

    return data;
};