import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import path from 'path';
import pg from 'pg';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { ClientError } from './middleware/client-error.js';
import { errorMiddleware } from './middleware/error-middleware.js';
import authMiddleware from './middleware/auth-middleware.js';

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const __filename = fileURLToPath(import.meta.url);
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

// For 'Guest' user functionality
async function findGuestUser() {
    const sql = `
        SELECT "user_id", "username"
        FROM "users"
        WHERE "username" = 'Guest'
    `;
    const result = await db.query(sql);
    const [user] = result.rows;
    return user;
}

// API routes go here
// Example: app.post('/api/auth/sign-up', async (req, res, next) => { ... });
// app.get('/api/scores', async (req, res, next) => { ... });

app.post('/api/users/register', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ClientError(400, 'username and password are required fields');
    }
    argon2.hash(password)
        .then(hashedPassword => {
            const sql = `
                INSERT INTO "users" ("username", "hashed_password")
                VALUES ($1, $2)
                RETURNING "user_id", "username", "created_at"
            `;
            const params = [username, hashedPassword];
            db.query(sql, params)
                .then(result => {
                    const [user] = result.rows;
                    const { user_id } = user;
                    const payload = { user_id, username };
                    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                    res.status(201).json({ token, user: payload });
                })
                .catch(err => next(err));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'an unexpected error occurred'
            });
        });
})

app.post('/api/users/sign-in', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ClientError(401, 'invalid login');
    }
    const sql = `
        SELECT "user_id",
               "hashed_password"
          FROM "users"
         WHERE "username" = $1
    `;
    const params = [username];
    db.query(sql, params) 
        .then (async result => {
            const [user] = result.rows;
            if (!user) {
                throw new ClientError(401, 'invalid login');
            }
            const { user_id, hashed_password } = user;
            const isMatching = await argon2.verify(hashed_password, password);
            if (!isMatching) {
                throw new ClientError(401, 'invalid login');
            }
            const payload = { user_id, username };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET);
            res.json({ token, user: payload });
        })
        .catch(err => next(err));
});

app.post('/api/users/guest-sign-in', async (req, res, next) => {
    try {
        const guestUser = await findGuestUser();

        if (!guestUser) {
            throw new ClientError(500, 'Guest user not found on server.');
        }

        const { user_id, username } = guestUser;
        const payload = { user_id, username };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        res.json({ token, user: payload });
    } catch (err) {
        console.error('Guest sign-in error: ', err);
        next(err);
    }
})

app.delete('/api/users/:userId/delete-account', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { user_id: authenticatedUserId } = req.user;
        const { password } = req.body;

        if (parseInt(userId) !== authenticatedUserId) {
            throw new ClientError(403, 'Unauthorized. You can only delete your own account.');
        }

        // 1. Fetch the user's hashed password
        const sql = `
            SELECT "hashed_password"
            FROM "users"
            WHERE "user_id" = $1;
        `;
        const params = [userId];
        const result = await db.query(sql, params);
        const [user] = result.rows;

        if (!user) {
            throw new ClientError(404, 'User not found');
        }

        // 2. Verify the provided password
        const isMatching = await argon2.verify(user.hashed_password, password);
        if (!isMatching) {
            throw new ClientError(401, 'Incorrect password');
        }

        // 3. Delete the user from the database
        const deleteSql = `
            DELETE FROM "users"
            WHERE "user_id" = $1;
        `;
        await db.query(deleteSql, params);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

app.use(errorMiddleware);

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
