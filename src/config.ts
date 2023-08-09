import dotenv from 'dotenv';

dotenv.config();

export const { PORT, MONGO_URL, NODE_ENV, JWT_SECRET, REFRESH_SECRET, FORGET_SECRET, BACKEND_URL, GMAIL_USER,
    GMAIL_PASSWORD } = process.env;