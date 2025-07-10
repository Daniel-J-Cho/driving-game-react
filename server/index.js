import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import pg from 'pg';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { fileURLtoPath } from 'url';

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const __filename = fileURLtoPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const publicPath = path.join(__dirname, '../dist');

// Serve static files from the client's build output (/dist) in production
// In development, Vite serves the client, so this block would be for production builds.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(publicPath));
}

// Middleware for parsing JSON request bodies
app.use(express.json());

// API routes go here
// Example: app.post('/api/auth/sign-up', async (req, res, next) => { ... });
// app.get('/api/scores', async (req, res, next) => { ... });

// If in production, handle client-side routing by serving index.html for all unmatched routes
// This is important for single-page applications (SPAs) like React.
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
}

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`)
    console.log('NODE_ENV:', process.env.NODE_ENV);
});

process.on('SIGINT', () => {
    db.end(() => {
        console.log('PostgreSQL pool has ended.');
        process.exit(0);
    });
});
