import { Server } from 'http';
import express from 'express';
import cors from 'cors';
import 'module-alias/register';
import bodyParser from 'body-parser';

import { SocketIoMiddleware } from '@middlewares';

import { ReportsRoute, AuthorsRoute } from './routes';

const app: express.Application = express();
const http = new Server(app);
const PORT = process.env.PORT || 3001;
const VERSION = '1.0.0';
const socketMiddleWare = new SocketIoMiddleware(http);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    app: 'ripple-server',
    version: VERSION,
  });
});

app.use('/authors', socketMiddleWare.emitterMiddleware('authors'), AuthorsRoute);
app.use('/reports', socketMiddleWare.emitterMiddleware('reports'), ReportsRoute);

const server = http.listen(PORT, () => {
  console.log(`App started on http://localhost:${PORT}`);
});
