import Routhr from 'routhr';
const port: any = process.env.PORT || 3002;
const cors = require('cors');
require('dotenv').config();
const app = new Routhr();
app.use(cors());
app.use(app.middleware.bodyParser.json);
import routes from './api/route';
app.useRoutes(routes);
app.start(port, () => {
    console.log(`Server started on port ${port}`);
});
