import request from "supertest";
import server from "../../server";

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const res = await request(server)
            .post('/api/products')
            .send({
                name: "",
                price: -100,
                availability: true
            });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
    it('shoduld create a new product', async () => {
        const res = await request(server).post('/api/products').send({
                name: "Mouse - Testing",
                price: 100,
                availability: true
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
    })

});
describe('GET /api/products', () => {

    it('should check if api/products exists', async () => {
        const res = await request(server).get('/api/products');
        expect(res.status).not.toBe(404);
        expect(res.status).toBeDefined();
    });

    it('should return a list of products', async () => {
        const res = await request(server).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveLength(1);

        expect(res.status).not.toBe(404);
        expect(res.body).not.toHaveProperty('errors');
    });

});
describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
        const res = await request(server).get('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.id).toBe(1);
        expect(res.body.data).not.toHaveProperty('errors');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('price');
        expect(res.body.data).toHaveProperty('availability');
        expect(res.headers['content-type']).toMatch(/json/);
    });
    it('should return 404 if product not found', async () => {
        const productId = 999;
        const res = await request(server).get(`/api/products/${productId}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Product not found');
    });
    it('should check a valid ID', async () => {
        const res = await request(server).get('/api/products/abc');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
});
describe('PUT /api/products/:id', () => {
    it('should not update a product', async () => {
        const res = await request(server)
            .put('/api/products/1').send({})
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
    it('should display validation errors messages when updating a product', async () => {
        const res = await request(server)
            .put('/api/products/1')
            .send({
                name: "",
                price: -100,
                availability: "yes"
            });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
    it('should not update a product for a invalid url', async () => {
        const res = await request(server)
            .put('/api/products/abc')
            .send({
                name: "Mouse - Updated",
                price: 150,
                availability: false
            });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
    it('should return a 404 if product to update is not found', async () => {
        const res = await request(server)
            .put('/api/products/999')
            .send({
                name: "Mouse - Updated",
                price: 150,
                availability: false
            });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Product not found');
    });
});
describe('PATCH /api/products/:id', () => {
    it('should update product availability', async () => {
        const res = await request(server).patch('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    }
    );
    it('should return 404 if product to update is not found', async () => {
        const res = await request(server).patch('/api/products/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Product not found');
    });
    it('should check a valid ID when updating availability', async () => {
        const res = await request(server).patch('/api/products/abc');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
});
describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
        const res = await request(server).delete('/api/products/1');
        expect(res.status).toBe(200);
    }
    );
    it('should return 404 if product to delete is not found', async () => {
        const res = await request(server).delete('/api/products/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Product not found');
    });
    it('should check a valid ID when deleting a product', async () => {
        const res = await request(server).delete('/api/products/abc');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
});