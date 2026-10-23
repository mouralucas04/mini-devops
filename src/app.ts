import express from "express";
import { tasksRouter } from "./tasks";

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter)

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/hello/:name', (req, res) => {
    res.json({ message: `Olá, ${req.params.name}!` });
});

export default app;