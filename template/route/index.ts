import { RouteInterface } from 'routhr';
const api_version = process.env.API_VERSION || 'api/v1';
import prodHandler from './handler/product/get';
import prodMiddleware from '../middleware/product/get';
const routes: RouteInterface[] = [
    {
        path: `/${api_version}/products/lookup`,
        method: 'GET',
        handler: prodHandler,
        middleware: prodMiddleware,
    },
];

export default routes;