import 'dotenv/config';

import { MESSAGES, RESPONSE_STATUS_CODE, SYSTEM_FILE_DIRECTORY, } from '../constants';

import { updateMessage, } from '../util';

import db from '../Model';

const { BE_URL, } = process.env;
const AVATAR_PATH = BE_URL + SYSTEM_FILE_DIRECTORY.UPLOAD + '/';

// Application-owned user data. Intentionally returns ONLY profile fields:
// identity attributes (email, role, isVerify) are delivered by the auth layer
// (login response / token), so this resource stays independent of the provider.
const serializeProfile = (profile) => {
    const avatar = profile?.avatar;

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
    const profile = await db.Profile.findOne({
        where: { userId, },
        include: [
            {
                model: db.File,
                as: 'avatar',
                required: false,
                attributes: ['id', 'src', 'uniqueName'],
            }
        ],
    });

    if (!profile) {
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    return serializeProfile(profile.toJSON());
};

export const updateProfile = async (userId, body) => {
    const profile = await db.Profile.findOne({ where: { userId, }, });
    if (!profile) {
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    // Allowlist the fields a user may change on their own profile
    if (body.readingGoal !== undefined) {
        profile.readingGoal = body.readingGoal;
    }
    if (body.displayName !== undefined) {
        profile.displayName = body.displayName?.trim() || null;
    }
    if (body.avatarFileId !== undefined) {
        profile.avatarFileId = body.avatarFileId;
    }
    if (body.notifyByEmail !== undefined) {
        profile.notifyByEmail = body.notifyByEmail;
    }

    await profile.save();

    return await getProfile(userId);
};

export const updateReadingGoal = async (userId, goal) => {
    return await updateProfile(userId, { readingGoal: goal, });
};
