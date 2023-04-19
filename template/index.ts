import Routhr from 'routhr';
import { setEnv } from './config';
setEnv();
const port: any = process.env.PORT || 3002;
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './api/route';
const routhr = new Routhr();
routhr.use(cors());
routhr.use(routhr.json());
routhr.use(cookieParser());
routhr.use(routhr.urlencoded({ extended: true }));
routhr.useRoutes(routes);
routhr.start(port, () => {
    console.log(`Server started on port ${port}`);
});
