import Routhr from 'routhr';
const port: any = process.env.PORT || 3002;
import cors from 'cors';
const app = new Routhr();
setEnv();
app.use(cors());
app.use(app.middleware.bodyParser.json);
import routes from './api/route';
import { setEnv } from './config';
app.useRoutes(routes);
app.start(port, () => {
    console.log(`Server started on port ${port}`);
});
