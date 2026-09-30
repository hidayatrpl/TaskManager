const request = require('supertest');
const app = require('../../app');

describe('Category Endpoints', () => {
    let token;
    let categoryId;

    beforeAll(async () => {
        const testUser = {
            username: 'categorytestuser_' + Date.now(),
            email: `categorytest${Date.now()}@example.com`,
            password: 'password123'
        };
        await request(app).post('/api/auth/register').send(testUser);

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ username: testUser.username, password: testUser.password });

        token = loginRes.body.payload.data.token;
    });

    test('POST /api/categories - berhasil tambah category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Category Test ' + Date.now() });

        expect(res.statusCode).toBe(201);
        expect(res.body.payload.data).toHaveProperty('id');

        categoryId = res.body.payload.data.id;
    });

    test('GET /api/categories - berhasil ambil list category', async () => {
        const res = await request(app)
            .get('/api/categories')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.payload.data)).toBe(true);
    });

    test('GET /api/categories/:id - berhasil ambil category berdasarkan ID', async () => {
        const res = await request(app)
            .get(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.payload.data[0].id).toBe(categoryId);
    });

    test('PUT /api/categories/:id - berhasil update category', async () => {
        const res = await request(app)
            .put(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Category Update ' + Date.now() });

        expect(res.statusCode).toBe(200);
        expect(res.body.payload.data.id).toBe(categoryId);
    });

    test('GET /api/categories/:id - gagal akses category milik user lain', async () => {
        // userB
        const userB = {
            username: 'userB_' + Date.now(),
            email: `userB${Date.now()}@example.com`,
            password: 'password123'
        };
        await request(app).post('/api/auth/register').send(userB);
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ username: userB.username, password: userB.password });
        const tokenB = loginRes.body.payload.data.token;

        const res = await request(app)
            .get(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${tokenB}`);

        expect(res.statusCode).toBe(404);
    });

    test('DELETE /api/categories/:id - berhasil hapus category', async () => {
        const res = await request(app)
            .delete(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});