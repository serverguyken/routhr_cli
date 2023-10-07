import Routhr from 'routhr';
import { setEnv } from './src/config';
setEnv();
const port: any = process.env.PORT || 3002;
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AppController from '@/controller/app.controller';
import ProductsController from '@/controller/product.controller';
import ENVVALUES from '@/config/env';

function init() {
    const app = new Routhr();
    app.use(cors());
    app.use(app.json());
    app.use(cookieParser());
    app.use(app.urlencoded({ extended: true }));
    app.setGlobalPrefix(ENVVALUES.API_VERSION);
    app.useControllers([AppController, ProductsController])
    app.start(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

init();