import { Document, } from 'mongoose';

// SQL Models
export interface IAuthorAttributes {
    id: number;
    name: string;
    image: string;
    genre: string;
    isVerify: boolean;
}

export interface IFileAttributes {
    id: number;
    extension: string;
    realFileName: string;
    src: string; // Desire user name
    uniqueName: string;
}

export interface IProductAttributes {
    id: number;
    productTitle: string;
    genre: string;
    isVerify: string;
}

export interface IProductStatusAttributes {
    userId: number;
    productId: number;
    statusId: number;
    isDelete: boolean;
}

export interface IProductAuthorAttributes {
    id: number;
    productId: number;
    authorId: number;
}

export interface IProductFileAttributes {
    id: number;
    productId: number;
    fileId: number;
}

export interface ISessionModelAttributes {
    id: number;
    connectId: string;
    userId: number;
    connectedAt: string;
    disconnectedAt: string;
}

export interface IStateAttributes {
    id: number;
    stateName: string;
    symbol: string;
}

export interface IUserAttributes {
    id: number;
    email: string;
    isDelete: boolean;
    isVerify: boolean;
    password: string;
    year: number;
    role: string;
}

export interface IMessageAttributes {
    id: number;
    roomName: string;
    senderId: string;
    message: string;
    isDelete: boolean;
}

export interface IMessageStatusAttributes {
    messageId: string;
    status: string;
}

// NoSql Models
export interface IUserData {
    userAddress: string;
}

export interface IVerifyToken extends Document {
    token: string;
    address: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}