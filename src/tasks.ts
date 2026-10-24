import { Router } from 'express';

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

function readField(body: unknown, field: string): unknown {
  if (typeof body !== 'object' || body === null) {
    return undefined;
  }
  return (body as Record<string, unknown>)[field];
}

export function createTasksRouter(): Router {
  const tasks: Task[] = [];
  let nextId = 1;

  function getTaskById(id: string): Task | undefined {
    return tasks.find((task) => task.id === parseInt(id));
  }

  const router = Router();

  router.get('/', (req, res) => {
    res.json(tasks);
  });

  router.get('/:id', (req, res) => {
    const task = getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  });

  router.post('/', (req, res) => {
    const title: unknown = readField(req.body, 'title');
    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({
        error: 'Field "title" is required and must be a non-empty string',
      });
      return;
    }
    const task: Task = {
      id: nextId++,
      title: title,
      done: false,
    };
    tasks.push(task);
    res.status(201).json(task);
  });

  router.patch('/:id', (req, res) => {
    const task = getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    const done: unknown = readField(req.body, 'done');
    if (typeof done !== 'boolean') {
      res.status(400).json({ error: 'Field "done" must be true or false' });
      return;
    }
    task.done = done;
    res.json(task);
  });

  router.delete('/:id', (req, res) => {
    const index = tasks.findIndex(
      (task) => task.id === parseInt(req.params.id),
    );
    if (index === -1) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    tasks.splice(index, 1);
    res.status(204).end();
  });

  return router;
}
