import 'dotenv/config';

import { MESSAGES, RESPONSE_STATUS_CODE, SYSTEM_FILE_DIRECTORY } from '../constants';
import { type IProfileWithAvatar, repositories } from '../repositories';
import { updateMessage } from '../util';

const { BE_URL } = process.env;
const AVATAR_PATH = BE_URL + SYSTEM_FILE_DIRECTORY.UPLOAD + '/';

const serializeProfile = (profile: IProfileWithAvatar) => {
    const { avatar } = profile;

    return {
        userId: profile.userId,
        year: profile.year,
        readingGoal: profile.readingGoal,
        displayName: profile.displayName ?? null,
        notifyByEmail: profile.notifyByEmail,
        avatarFileId: profile.avatarFileId ?? null,
        avatarUrl: avatar?.uniqueName ? AVATAR_PATH + avatar.uniqueName : null,
        avatarSrc: avatar?.src ?? null,
    };
};

export const getProfile = async (userId) => {
    const profile = await repositories.profile.findByUserIdWithAvatar(userId);

    if (!profile) {
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    return serializeProfile(profile);
};

export const updateProfile = async (userId, body) => {
    const profile = await repositories.profile.findByUserId(userId);
    if (!profile) {
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const updates: Parameters<typeof repositories.profile.updateByUserId>[1] = {};
    if (body.readingGoal !== undefined) {
        updates.readingGoal = body.readingGoal;
    }
    if (body.displayName !== undefined) {
        updates.displayName = body.displayName?.trim() || null;
    }
    if (body.avatarFileId !== undefined) {
        updates.avatarFileId = body.avatarFileId;
    }
    if (body.notifyByEmail !== undefined) {
        updates.notifyByEmail = body.notifyByEmail;
    }

    await repositories.profile.updateByUserId(userId, updates);

    return getProfile(userId);
};

export const updateReadingGoal = async (userId, goal) => {
    return updateProfile(userId, { readingGoal: goal });
};
