import { SECONDS_IN_30_DAYS } from '../constants';

import { cacheDataWithExpiration, fetchCacheData } from './cacheService';
import { migrateRoomMemberships } from './support/chatRoomService';
import { migrateQueueEntryPrincipal, migrateSupportAgentPrincipal } from './support/supportManagerService';

const MARKER_TTL_SECONDS = SECONDS_IN_30_DAYS;
const markerKey = (clientId: string) => `principalMigration:${clientId}`;

export interface MigrationResult {
    migrated: boolean;
    roomsTouched: string[];
}

export const promoteAnonToUser = async (
    clientId: string,
    userId: number,
    displayName?: string,
): Promise<MigrationResult> => {
    const oldPrincipal = `anon:${clientId}`;
    const newPrincipal = `user:${userId}`;

    const existing = await fetchCacheData(markerKey(clientId));
    if (existing && String(existing) === String(userId)) {
        return { migrated: false, roomsTouched: [] };
    }

    const roomsTouched = await migrateRoomMemberships(oldPrincipal, newPrincipal);
    await migrateQueueEntryPrincipal(oldPrincipal, newPrincipal, displayName);
    await migrateSupportAgentPrincipal(oldPrincipal, newPrincipal);

    await cacheDataWithExpiration(markerKey(clientId), userId, MARKER_TTL_SECONDS);

    return { migrated: true, roomsTouched };
};
