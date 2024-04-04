import express from 'express';
import { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDatabase } from './services/databaseConnection';
import userRouter from './routes/OceanCanvas/userRouter';
import productRouter from './routes/OceanCanvas/productRouter';
import orderRouter from './routes/OceanCanvas/orderRouter';
import sizeRouter from './routes/OceanCanvas/sizeRouter';
import categoryRouter from './routes/OceanCanvas/categoryRouter';
import emailRouter from './routes/OceanCanvas/emailRouter';
import bookingsRouter from './routes/Melissa/bookings';
import swishRouter from './routes/swishRouter';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'https://oceancanvas-frontend.onrender.com',
      'https://melissa-restaurant.onrender.com',
      'https://alengusinac.github.io/',
    ],
    methods: ['GET', 'POST', 'PUT'],
  })
);

app.use(express.json({ limit: '5000kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '5000kb',
  })
);
app.use(morgan('dev'));
connectDatabase();

app.get('/', (req: Request, res: Response) => {
  res.send('Application really works!');
});

app.use('/ocean-canvas/users', userRouter);
app.use('/ocean-canvas/products', productRouter);
app.use('/ocean-canvas/orders', orderRouter);
app.use('/ocean-canvas/sizes', sizeRouter);
app.use('/ocean-canvas/categories', categoryRouter);
app.use('/ocean-canvas/newsletter', emailRouter);

app.use('/melissa/bookings', bookingsRouter);

app.use('/swish', swishRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Application started on port ${process.env.SERVER_PORT}!`);
});
