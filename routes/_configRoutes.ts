import { Router } from 'express';

import * as configController from '../controller/configController';
import { isAuthenticated } from '../middleware';

const config = Router();

config.get('/goal-status-ids', isAuthenticated(), configController.getGoalStatusIds);

export default config;
