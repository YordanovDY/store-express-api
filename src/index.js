import express from 'express';
import routes from './routes.js';
import allowCORSRequests from './middlewares/cors-middleware.js';

const app = express();

app.use(express.json());

app.use(allowCORSRequests({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}));

app.use(routes);

app.listen(3030, () => console.log(`Server is listening on: http://localhost:3030`));