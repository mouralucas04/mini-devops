import { beforeEach, describe, expect, it } from '@jest/globals';
import { Express } from 'express';
import request from 'supertest';
import { createApp } from './app';

describe('tasks routes', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  it('starts with an empty list', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('creates a task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'study jest' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      title: 'study jest',
      done: false,
    });
  });
});
