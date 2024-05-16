import { Router, } from 'express';

const seach = Router();

import * as searchController from '../controller/searchController';


seach.get('/view',
    searchController.viewUserBooksFromEmail
);

export default seach;