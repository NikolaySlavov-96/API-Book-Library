import { Document, } from 'mongoose';

// SQL Models
export interface IAuthorFileAttributes {
    id: number;
    authorId: number;
    fileId: number;
}

export interface IAuthorAttributes {
    id: number;
    name: string;
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
    pages?: number;
    publishedYear?: number;
    description?: string;
}

export interface IProductRatingAttributes {
    id: number;
    userId: number;
    productId: number;
    rating: number;
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

// Identity / authentication only.
export interface IUserAttributes {
    id: number;
    email: string;
    isDelete: boolean;
    isVerify: boolean;
    password: string;
    role: string;
}

// Application-owned user data, linked to the identity key via `userId`.
export interface IProfileAttributes {
    id: number;
    userId: number;
    year: number;
    readingGoal?: number;
    displayName?: string;
    avatarFileId?: number;
    notifyByEmail?: boolean;
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