import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/environment';
import { FireTVService } from './services/firetv-service';
import { FireTVController } from './controllers/firetv-controller';
import { createRouter } from './routes/firetv-routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

const service = new FireTVService(env.FIRETV_IP);
const controller = new FireTVController(service);
const router = createRouter(controller);

app.use('/api/v1', router);
app.use(errorHandler);

app.listen(env.PORT, async () => {
  console.log(`FireTV Remote server running on port ${env.PORT}`);
  console.log(`FireTV IP: ${env.FIRETV_IP}`);
  try {
    await service.connect();
    console.log(`ADB connected to ${env.FIRETV_IP}`);
  } catch (err) {
    console.warn(`Could not connect to FireTV at startup: ${(err as Error).message}`);
  }
});
