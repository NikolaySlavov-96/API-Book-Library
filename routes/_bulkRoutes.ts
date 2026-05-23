import { Router } from 'express';

const bulk = Router();

import * as bulkController from '../controller/bulkController';
import { isAuthenticated } from '../middleware';

bulk.post('/', isAuthenticated(), bulkController.createBulk);

export default bulk;
