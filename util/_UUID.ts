import { v4 as uuidV4, } from 'uuid';

export const _UUID = () => {
    const newUUID = uuidV4();
    return newUUID;
};
