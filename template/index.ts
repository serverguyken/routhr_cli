import Routhr from 'routhr';
const port: any = process.env.PORT || 3002;
const cors = require('cors');
require('dotenv').config();
const routhr = new Routhr(port);
routhr.use(cors());
import routes from './route/routes';
routhr.useRoutes(routes);
routhr.listen();