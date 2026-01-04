import Request from "supertest";
import server, {connectDB} from "../server";
import db from "../config/db";

describe('Nuestro primer test', () => {
    it('Debe revisar que 1 + 1 es 2', () => {
        expect(1 + 1).toBe(2)
    })
});


describe('GET API /', () => {
    it('Debe responder con un 200 OK', async () => {
        const res = await Request(server).get('/api/products');

        expect(res.status).toBe(200);
        
        expect(res.headers['content-type']).toMatch(/json/);

    })
})

jest.mock('../config/db');

describe('Conexión a la base de datos', () => {
    it('should handle database connection errors', async () => {
        jest.spyOn(db, 'authenticate').mockRejectedValue(new Error());
        const consoleErrorSpy = jest.spyOn(console, 'log');

        await connectDB();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error al conectar a la base de datos')
        );
        
    });
});