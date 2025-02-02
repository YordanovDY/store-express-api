import express from 'express';
import routes from './routes.js';
import allowCORSRequests from './middlewares/cors-middleware.js';
import expressInit from './config/express-config.js';
import { PORT } from './config/constants.js';

const app = express();

app.use(express.json());

expressInit(app);

app.use(routes);

app.listen(PORT, () => console.log(`Server is listening on: http://localhost:${PORT}`));