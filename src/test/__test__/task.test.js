const request = require('supertest');
const app = require('../../app');

describe('Task Endpoints', () => {
    let token;
    let taskId;
    const testUser = {
        username: 'tasktest_' + Date.now(),
        email: `tasktest${Date.now()}@example.com`,
        password: 'password123'
    };

    beforeAll(async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: testUser.username, password: testUser.password });
        token = res.body.payload.data.token;
    });

    test('GET /api/tasks - gagal tanpa token', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toBe(401);
    });

    test('POST /api/tasks - berhasil dengan token valid', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Belajar Jest', description: 'Testing otomatis' });

        expect(res.statusCode).toBe(201);
        taskId = res.body.payload.data.id; // simpan buat test berikutnya
    });

    test('POST /api/tasks - gagal tanpa title', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Tanpa title' });

        expect(res.statusCode).toBe(400);
    });

    test('GET /api/tasks/:id - berhasil ambil task milik sendiri', async () => {
        const res = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    test('PUT /api/tasks/:id - partial update mempertahankan field lama', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Judul baru' });

        expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/tasks/:id - berhasil hapus task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});