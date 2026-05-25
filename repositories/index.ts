import { dbRead, dbWrite } from '../db';

import {
    AuthorFileRepository,
    AuthorRepository,
    FileRepository,
    MessageRepository,
    MessageStatusRepository,
    ProductAuthorRepository,
    ProductFileRepository,
    ProductRatingRepository,
    ProductRepository,
    ProductStatusRepository,
    ProfileRepository,
    SessionRepository,
    StateRepository,
    UserRepository,
} from './drizzle';
import {
    type IAuthorFileRepository,
    type IAuthorRepository,
    type IFileRepository,
    type IMessageRepository,
    type IMessageStatusRepository,
    type IProductAuthorRepository,
    type IProductFileRepository,
    type IProductRatingRepository,
    type IProductRepository,
    type IProductStatusRepository,
    type IProfileRepository,
    type IRefreshTokenRepository,
    type ISessionRepository,
    type IStateRepository,
    type IUserDataRepository,
    type IUserRepository,
    type IVerifyTokenRepository,
} from './interfaces';
import { RefreshTokenRepository, UserDataRepository, VerifyTokenRepository } from './mongoose';

export interface IRepositoryContainer {
    user: IUserRepository;
    profile: IProfileRepository;
    author: IAuthorRepository;
    file: IFileRepository;
    product: IProductRepository;
    productAuthor: IProductAuthorRepository;
    productFile: IProductFileRepository;
    authorFile: IAuthorFileRepository;
    productStatus: IProductStatusRepository;
    productRating: IProductRatingRepository;
    message: IMessageRepository;
    messageStatus: IMessageStatusRepository;
    session: ISessionRepository;
    state: IStateRepository;
    verifyToken: IVerifyTokenRepository;
    refreshToken: IRefreshTokenRepository;
    userData: IUserDataRepository;
}

export const repositories: IRepositoryContainer = {
    user: new UserRepository(dbRead, dbWrite),
    profile: new ProfileRepository(dbRead, dbWrite),
    author: new AuthorRepository(dbRead, dbWrite),
    file: new FileRepository(dbRead, dbWrite),
    product: new ProductRepository(dbRead, dbWrite),
    productAuthor: new ProductAuthorRepository(dbWrite),
    productFile: new ProductFileRepository(dbWrite),
    authorFile: new AuthorFileRepository(dbWrite),
    productStatus: new ProductStatusRepository(dbRead, dbWrite),
    productRating: new ProductRatingRepository(dbRead, dbWrite),
    message: new MessageRepository(dbWrite),
    messageStatus: new MessageStatusRepository(dbWrite),
    session: new SessionRepository(dbWrite),
    state: new StateRepository(dbRead),
    verifyToken: new VerifyTokenRepository(),
    refreshToken: new RefreshTokenRepository(),
    userData: new UserDataRepository(),
};

export * from './interfaces';
