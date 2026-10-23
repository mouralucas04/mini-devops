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
    const task: Task = {
        id: nextId++,
        title: req.body.title,
        done: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

