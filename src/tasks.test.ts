import { beforeEach, describe, expect, it } from '@jest/globals';
import { Express } from 'express';
import request from 'supertest';
import { createApp } from './app';

describe('tasks routes', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /tasks', () => {
    it('starts with an empty list', async () => {
      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /tasks', () => {
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

    it('rejects a request without title', async () => {
      const response = await request(app).post('/tasks').send({});

      expect(response.status).toBe(400);
    })

    it('rejects a request without body', async () => {
      const response = await request(app).post('/tasks')

      expect(response.status).toBe(400);
    })
  });

  describe('GET /tasks/:id', () => {
    it('returns 400 for a malformed id', async () => {
      await request(app).post('/tasks').send({ title: 'study jest' });

      const response = await request(app).get('/tasks/1abc');

      expect(response.status).toBe(400);
    });
  });
});
