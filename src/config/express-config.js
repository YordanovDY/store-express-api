import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import allowCORSRequests from '../middlewares/cors-middleware.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { optionsMiddleware } from '../middlewares/options-middleware.js';
import 'dotenv/config';

const { SESSION_SECRET } = process.env;

export default function expressInit(app) {
    app.use(express.json());

    app.use(cookieParser());

    app.use(expressSession({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));

    app.use(allowCORSRequests({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }));

    app.use(authMiddleware());

    app.use(optionsMiddleware());
}