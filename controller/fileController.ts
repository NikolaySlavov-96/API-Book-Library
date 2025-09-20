import { MESSAGES, RESPONSE_STATUS_CODE, } from '../constants';

import * as fileService from '../services/fileService';

import { updateMessage, } from '../util';

export const addFile = async (req, res, next) => {
    try {
        if (!req.files) {
            res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(updateMessage(MESSAGES.PLEASE_ADDED_FILE).user);
            return;
        }
        const { deliverFile, } = req.files;
        const fileData = await fileService.addingFile(deliverFile, req.body);

        res.status(RESPONSE_STATUS_CODE.OK).json(fileData);
    } catch (err) {
        next(err);
    }
};

export const removeFile = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const resultFromUnlink = await fileService.removeFile(fileId);
        res.status(resultFromUnlink.statusCode).json(resultFromUnlink.user);
    } catch (err) {
        next(err);
    }
};