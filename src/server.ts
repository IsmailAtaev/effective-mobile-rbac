import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { contract } from './api/contracts';
import { router } from './app/controller';
import { connectCheck } from './infra/db';
import { envCheck } from './infra/env';
import { getEnv } from './infra/env/service';
import { openApi, errorUtil } from './utils';

const app = express();
const port = getEnv('PORT');
const host = getEnv('HOST');
const cookieSecret = getEnv('COOKIE_SECRET');

const s = initServer();

const start = async () => {
  try {
    await envCheck();
    await connectCheck();

    app.use(cookieParser(cookieSecret));

    const allowedOrigins = getEnv('ALLOWED_ORIGINS').split(',');

    app.use(cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
          cb(null, true);
          return;
        }

        cb(null, false);
      },
      credentials: true,
    }));

    app.use(helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/public', express.static(path.join(process.cwd(), 'public')));

    app.get('/api/openapi', async (req, res) => res.json(openApi.document));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApi.document));

    createExpressEndpoints(contract, router, app, {
      requestValidationErrorHandler: errorUtil.requestValidationErrorHandler,
      logInitialization: true,
    });

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err.status) {
        res.status(err.status).send({
          message: err.message,
          statusCode: err.status,
          error: err.name
        });
      } else {
        console.error(err);
        res.status(500).send({
          message: 'Internal Server Error',
          statusCode: 500,
          error: 'Internal Server Error'
        });
      }
    });

    app.listen(port as unknown as number, host, () => {
      console.log(`http://${host}:${port}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
