import 'dotenv/config';

import { SYSTEM_FILE_DIRECTORY } from '../../constants';
import { type TFileRecord } from '../../repositories';

const { BE_URL } = process.env;
const FILE_PATH = BE_URL + SYSTEM_FILE_DIRECTORY.UPLOAD + '/';

const fileModel = (data: TFileRecord[] | undefined | null) => {
    const firstFile = data?.[0];
    return {
        fileUrl: FILE_PATH + (firstFile?.uniqueName ?? 'productNotFound.png'),
        fileSrc: firstFile?.src ?? 'Stay happy',
        fileId: firstFile?.id ?? 'missing',
    };
};

export default fileModel;
