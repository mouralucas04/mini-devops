import { Router } from "express";

export interface Task {
    id: number;
    title: string;
    done: boolean;
}

const tasks: Task[] = [];
let nextId = 1;

function getTaskById(id: string): Task | undefined {
    return tasks.find(task => task.id === parseInt(id));
}

function readField(body: unknown, field: string): unknown {
    if (typeof body !== 'object' || body === null) {
        return undefined;
    }
    return (body as Record<string, unknown>)[field];
}

export const tasksRouter = Router();

tasksRouter.get('/', (req, res) => {
    res.json(tasks);
});

tasksRouter.get('/:id', (req, res) => {
    const task = getTaskById(req.params.id);
    if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
    }
    res.json(task);
});

tasksRouter.post('/', (req, res) => {
    const title: unknown = readField(req.body, 'title');
    if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'Field "title" is required and must be a non-empty string' });
        return;
    }
    const task: Task = {
        id: nextId++,
        title: title,
        done: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

