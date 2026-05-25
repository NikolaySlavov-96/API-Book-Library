import { cacheKeys } from '../../constants';
import { normalizeInputData } from '../../util';
import { addDataToSet, fetchSetMembers, isSetMember, removeDataFromSet } from '../cacheService';
import { type Principal } from '../principalService';

interface IQueuedUser {
    principal: Principal;
    name: string;
}

// Support
export const getAllOnlineSupports = async (): Promise<Principal[]> => {
    return fetchSetMembers(cacheKeys.SUPPORT_AGENT);
};

export const assignSupport = async (principal: Principal) => {
    await addDataToSet(cacheKeys.SUPPORT_AGENT, principal);
};

export const unassignSupport = async (principal: Principal) => {
    await removeDataFromSet(cacheKeys.SUPPORT_AGENT, principal);
};

export const isSupportAgent = async (principal: Principal): Promise<boolean> => {
    return isSetMember(cacheKeys.SUPPORT_AGENT, principal);
};

// User
const parseQueueEntry = (raw: string | undefined | null): IQueuedUser | null => {
    if (!raw) return null;
    try {
        const dataString = normalizeInputData(raw);
        const parsed = JSON.parse(dataString);
        if (!parsed || typeof parsed.principal !== 'string') return null;
        return parsed as IQueuedUser;
    } catch {
        return null;
    }
};

export const getAllWaitingUsers = async (): Promise<IQueuedUser[]> => {
    const userQueue = await fetchSetMembers(cacheKeys.USER_QUEUE);
    return userQueue.map((u) => parseQueueEntry(u)).filter((u): u is IQueuedUser => u !== null);
};

export const assignUserToQueue = async (data: IQueuedUser) => {
    // Remove previous entries for the same principal before adding (avoid duplicate display names)
    await unassignUserFromQueue(data.principal);
    await addDataToSet(cacheKeys.USER_QUEUE, JSON.stringify(data));
};

export const isUserInQueue = async (principal: Principal): Promise<IQueuedUser | null> => {
    if (!principal) return null;
    const result = await fetchSetMembers(cacheKeys.USER_QUEUE);
    for (const raw of result) {
        const parsed = parseQueueEntry(raw);
        if (parsed && parsed.principal === principal) {
            return parsed;
        }
    }
    return null;
};

export const unassignUserFromQueue = async (principal: Principal): Promise<boolean> => {
    if (!principal) return false;
    const list = await fetchSetMembers(cacheKeys.USER_QUEUE);
    let hasUser = false;
    for (const raw of list) {
        const parsed = parseQueueEntry(raw);
        if (parsed?.principal === principal) {
            await removeDataFromSet(cacheKeys.USER_QUEUE, raw);
            hasUser = true;
        }
    }
    return hasUser;
};

export const migrateQueueEntryPrincipal = async (
    oldPrincipal: Principal,
    newPrincipal: Principal,
    newName?: string,
): Promise<boolean> => {
    const list = await fetchSetMembers(cacheKeys.USER_QUEUE);
    let migrated = false;
    for (const raw of list) {
        const parsed = parseQueueEntry(raw);
        if (parsed?.principal === oldPrincipal) {
            await removeDataFromSet(cacheKeys.USER_QUEUE, raw);
            await addDataToSet(
                cacheKeys.USER_QUEUE,
                JSON.stringify({ principal: newPrincipal, name: newName ?? parsed.name }),
            );
            migrated = true;
        }
    }
    return migrated;
};

export const migrateSupportAgentPrincipal = async (
    oldPrincipal: Principal,
    newPrincipal: Principal,
): Promise<boolean> => {
    if (!(await isSetMember(cacheKeys.SUPPORT_AGENT, oldPrincipal))) return false;
    await addDataToSet(cacheKeys.SUPPORT_AGENT, newPrincipal);
    await removeDataFromSet(cacheKeys.SUPPORT_AGENT, oldPrincipal);
    return true;
};
