import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFoundRoute from './app/middlewares/notFroundRoute';
import config from './app/config';
import path from 'path';

const app: Application = express();
app.use(express.static(path.join(__dirname, 'public')));
// parsers
app.use(express.json());
app.use(cookieParser());

// app.use(cors({origin: 'http://localhost:3000',credentials:true}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'], // Add more origins as needed
  credentials: true,
}));

// app routes
app.use('/api/v1', router);

// global error handle zod, mongoose, custom error, error, cast error etc..
app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Pet care Server Running...',
  });
});

app.get('/confirmation', (req, res) => {
  res.sendFile(__dirname + '/public/confirmation.html');
});

// not found route
app.use(notFoundRoute);

export default app;
