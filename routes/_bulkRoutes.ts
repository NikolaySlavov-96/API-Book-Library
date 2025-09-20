import { Router, } from 'express';

const bulk = Router();

import { isAuthenticated, } from '../middleware';

import * as bulkController from '../controller/bulkController';

bulk.post('/',
    isAuthenticated(),
    bulkController.createBulk
);


export default bulk;