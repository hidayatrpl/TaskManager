const request = require('supertest');
const app = require('../../app');

describe('Auth Endpoints', () => {
    const testUser = {
        username: 'testuser_' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    test('POST /api/auth/register - berhasil daftar user baru', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.payload.data).toHaveProperty('id');
    });

    test('POST /api/auth/register - gagal kalau email sudah terdaftar', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toBe(409);
    });

    test('POST /api/auth/login - berhasil dengan kredensial benar', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: testUser.username, password: testUser.password });

        expect(res.statusCode).toBe(200);
        expect(res.body.payload.data).toHaveProperty('token');
    });

    test('POST /api/auth/login - gagal dengan password salah', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: testUser.username, password: 'passwordsalah' });

        expect(res.statusCode).toBe(401);
    });
});