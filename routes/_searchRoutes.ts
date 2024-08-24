import { Router, } from 'express';

const search = Router();

import * as searchController from '../controller/searchController';


search.get('/view',
    searchController.viewUserBooksFromEmail
);

export default search;