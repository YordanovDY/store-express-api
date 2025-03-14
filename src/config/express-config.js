import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
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

    app.use(cors({
        origin: 'http://localhost:5100',
        credentials: true
    }));

    app.use(authMiddleware());

    app.use(optionsMiddleware());
}