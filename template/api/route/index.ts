import { RouteInterface, RequestInterface, ResponseInterface } from 'routhr';
const api_version = process.env.API_VERSION || 'v1';
import prodHandler from './handler/product/get';
import prodMiddleware from '../middleware/product/get';
const routes: RouteInterface[] = [
    {
        path: `/`,
        method: 'GET',
        handler: (req: RequestInterface, res: ResponseInterface) => {
            res.status(200).json({
                message: 'Hello World from Routhr API',
            });
        },
    },
    {
        path: `/${api_version}/products/:prodID`,
        method: 'GET',
        handler: prodHandler,
        middleware: prodMiddleware,
    },
];

export default routes;