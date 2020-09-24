import express from 'express';
import config from './config';
import cors from 'cors'
import passport from 'passport';

import routes from './routes';
import { errorHandler, logErrors, wrapErrors } from './utils/handlers/errorHandler';
import notFoundHandler from './utils/handlers/notFoundHandler'

const app = express();

app.set('port', config.port);

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api', routes);

app.use(notFoundHandler);

app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

export default app;