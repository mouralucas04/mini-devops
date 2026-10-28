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

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        title: 'study jest',
        done: false,
      });
    });

    it('rejects a request without title', async () => {
      const response = await request(app).post('/tasks').send({});

      expect(response.status).toBe(400);
    });

    it('rejects a request without body', async () => {
      const response = await request(app).post('/tasks');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /tasks/:id', () => {
    it('returns an existing task', async () => {
      await request(app).post('/tasks').send({ title: 'study jest' });

      const response = await request(app).get('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        title: 'study jest',
      });
    });

    it('returns 404 for an unknown task', async () => {
      const response = await request(app).get('/tasks/99');

      expect(response.status).toBe(404);
    });

    it('returns 400 for a malformed id', async () => {
      await request(app).post('/tasks').send({ title: 'study jest' });

      const response = await request(app).get('/tasks/1abc');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('completes a task', async () => {
      await request(app).post('/tasks').send({ title: 'study jest' });

      const patchResponse = await request(app).patch('/tasks/1').send({
        done: true,
      });

      const getResponse = await request(app).get('/tasks/1');

      expect(patchResponse.status).toBe(200);
      expect(getResponse.body).toMatchObject({
        id: 1,
        title: 'study jest',
        done: true,
      });
    });

    it('rejects a body with non boolean done field', async () => {
      await request(app).post('/tasks').send({ title: 'study jest' });

      const patchResponse = await request(app).patch('/tasks/1').send({
        done: 'true',
      });

      const getResponse = await request(app).get('/tasks/1');

      expect(patchResponse.status).toBe(400);
      expect(getResponse.body).toMatchObject({
        id: 1,
        title: 'study jest',
        done: false,
      });
    });

    it('rejects a non existing task', async () => {
      const patchResponse = await request(app).patch('/tasks/1').send({
        done: true,
      });

      expect(patchResponse.status).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deletes an existing task', async () => {
      await request(app).post('/tasks').send({ title: 'study jest' });

      const deleteResponse = await request(app).delete('/tasks/1');
      const getResponse = await request(app).get('/tasks/1');

      expect(deleteResponse.status).toBe(204);
      expect(getResponse.status).toBe(404);
    });

    it('does not delete a non existing task', async () => {
      const responseDelete = await request(app).delete('/tasks/1');

      expect(responseDelete.status).toBe(404);
    });
  });
});
