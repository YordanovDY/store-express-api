import express from 'express';
import allowCORSRequests from '../middlewares/cors-middleware.js';

export default function expressInit(app) {
    app.use(express.json());

    app.use(allowCORSRequests({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }));
}