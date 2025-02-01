import express from 'express';
import routes from './routes.js';

const app = express();

app.use(routes);

app.listen(3030, () => console.log(`Server is listening on: http://localhost:3030`));