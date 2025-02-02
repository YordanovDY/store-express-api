import express from 'express';
import routes from './routes.js';
import databaseInit from './config/database-config.js';
import expressInit from './config/express-config.js';
import { PORT } from './config/constants.js';

const app = express();

await databaseInit();

expressInit(app);

app.use(routes);

app.listen(PORT, () => console.log(`Server is listening on: http://localhost:${PORT}`));