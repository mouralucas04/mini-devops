import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createApp } from './app';

describe('GET /health', () => {
  it('responds with status ok', async () => {
    const response = await request(createApp()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
