import express from 'express';
import { connectDB } from '@services/database';
import AuthRouter from '@routes/authRouter';
import errorHandler from '@middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import { PORT } from '@/config';

const app = express();
const port: number | string = PORT || 8000;


app.use(express.json());
app.use(cookieParser());
app.use('/api', AuthRouter);
app.use(errorHandler);


app.listen(port, async () => {
  connectDB();
  console.log(`Example app listening at http://localhost:${port}`);
});
