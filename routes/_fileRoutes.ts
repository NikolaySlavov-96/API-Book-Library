import { Router, } from 'express';
import { body, } from 'express-validator';

const file = Router();

import { expressValidator, isAuthenticated, } from '../middleware';

import * as fileController from '../controller/fileController';

import { ROUTING_MESSAGES, } from '../constants';

file.post('/addImage',
    isAuthenticated(),
    body('src').isLength({ min: 2, max: 145, }).withMessage(ROUTING_MESSAGES.FILE_NAME),
    expressValidator,
    fileController.addFile
);

// file.delete('/removeImage/:id',
//     isAuthenticated(),
//     fileController.removeImageOnProduct
// );

export default file;