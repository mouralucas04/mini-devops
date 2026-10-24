import express, { type Express } from 'express';
import { createTasksRouter } from './tasks';

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/tasks', createTasksRouter());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/hello/:name', (req, res) => {
    res.json({ message: `Olá, ${req.params.name}!` });
  });

  return app;
}
