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
import { RefreshTokenRepository, UserDataRepository, VerifyTokenRepository } from './mongoose';
import {
    type TAuthorFileRepository,
    type TAuthorRepository,
    type TFileRepository,
    type TMessageRepository,
    type TMessageStatusRepository,
    type TProductAuthorRepository,
    type TProductFileRepository,
    type TProductRatingRepository,
    type TProductRepository,
    type TProductStatusRepository,
    type TProfileRepository,
    type TRefreshTokenRepository,
    type TSessionRepository,
    type TStateRepository,
    type TUserDataRepository,
    type TUserRepository,
    type TVerifyTokenRepository,
} from './types';

export type TRepositoryContainer = {
    user: TUserRepository;
    profile: TProfileRepository;
    author: TAuthorRepository;
    file: TFileRepository;
    product: TProductRepository;
    productAuthor: TProductAuthorRepository;
    productFile: TProductFileRepository;
    authorFile: TAuthorFileRepository;
    productStatus: TProductStatusRepository;
    productRating: TProductRatingRepository;
    message: TMessageRepository;
    messageStatus: TMessageStatusRepository;
    session: TSessionRepository;
    state: TStateRepository;
    verifyToken: TVerifyTokenRepository;
    refreshToken: TRefreshTokenRepository;
    userData: TUserDataRepository;
};

export const repositories: TRepositoryContainer = {
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

export * from './types';
