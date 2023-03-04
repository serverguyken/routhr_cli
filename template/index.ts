import Routhr from 'routhr';
const port: any = process.env.PORT || 3002;
import cors from 'cors';
const app = new Routhr();
setEnv();
routhr.use(cors());
routhr.use(routhr.middleware.bodyParser.json);
import routes from './api/route';
import { setEnv } from './config';
routhr.useRoutes(routes);
routhr.start(port, () => {
    console.log(`Server started on port ${port}`);
});
