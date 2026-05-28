import { SYSTEM_FILE_DIRECTORY } from '../constants';
import messages from '../constants/_messages';
import { repositories } from '../repositories';
import { createDirectoryPath, unlinkFileFromSystem, updateMessage, UUID } from '../util';

const UPLOAD_DIRECTORY = SYSTEM_FILE_DIRECTORY.UPLOAD;

export const addingFile = async (deliverFile, body) => {
    const { src } = body;
    const { name: realFileName, mimetype } = deliverFile;

    const uniqueFileName = UUID();

    const [, fileExtension] = mimetype.split('/');
    const fileName = `${uniqueFileName}.${fileExtension}`;

    // Move the file first: a failed write must not leave an orphan DB row.
    const pathName = createDirectoryPath(UPLOAD_DIRECTORY, fileName);
    await deliverFile.mv(pathName);

    const created = await repositories.file.create({
        extension: fileExtension,
        realFileName,
        src,
        uniqueName: fileName,
    });

    const resourcePath = UPLOAD_DIRECTORY + '/' + fileName;
    return { resourcePath, fileId: created.id };
};

export const removeFile = async (fileId) => {
    const fileData = await repositories.file.findById(fileId);

    if (!fileData) {
        return updateMessage(messages.FILE_DOES_NOT_EXIT, 400);
    }

    await repositories.file.deleteById(fileId);

    const result = await unlinkFileFromSystem(UPLOAD_DIRECTORY, fileData.uniqueName);
    if (!result) {
        return updateMessage(messages.UN_SUCCESS_REMOVE_FILE, 400);
    }

    return updateMessage(messages.SUCCESS_REMOVE_FILE, 200);
};
