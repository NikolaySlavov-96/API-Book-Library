import 'dotenv/config';

const { BE_URL, } = process.env;

import { SYSTEM_FILE_DIRECTORY, } from '../../constants';

const FILE_PATH = BE_URL + SYSTEM_FILE_DIRECTORY.UPLOAD + '/';

const fileModel = (data) => {
    return {
        fileUrl: FILE_PATH + (data.uniqueName ?? 'productNotFound.png'),
        fileSrc: data.src ?? 'Stay happy',
        fileId: data?.id ?? 'missing',
    };
};

export default fileModel;