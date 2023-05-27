const request = require('supertest');
const api = require('../src/api.js');
const { seed } = require('../src/seed.js')

beforeEach(async () => {
    await seed()
})

describe("API substract", () => {
    test("Deberia responder con un 200 ok", async () => {
        const app = await api.build()

        return request(app).get('/api/v1/sub/2/1')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((res) => {
                expect(res.body.result).toEqual(1);
            })
    })
})

describe("API multiply", () => {
    test("Deberia responder con un 200 ok", async () => {
        const app = await api.build()

        return request(app).get('/api/v1/mul/3.1/5.4')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((res) => {
                expect(res.body.result).toBeCloseTo(16.74);
            })
    })
})

describe("API add", () => {
    test("Si segundo parámetro es negativo, el resultado tiene que ser menor al primer parámetro y el endpoint devuelver un status 200.", async () => {
        const app = await api.build()

        return request(app).get('/api/v1/add/2/-1')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((res) => {
                expect(res.body.result).toBeLessThan(2);
            })
    })
})

describe("API add", () => {
    test("La suma de 0.1 con 0.2, debe dar 0.3.", async () => {
        const app = await api.build()
        
        return request(app).get('/api/v1/add/0.1/0.2')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")

            .then((res) => {
                expect(res.body.result).toBeCloseTo(0.3);
            })
    })
})

describe("API power", () => {
    test("Deberia responder con un 400 Error", async () => {
        const app = await api.build()

        return request(app).get('/api/v1/pow/a')
            .expect(400)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((err) => {
                expect(err.body.error).toEqual("Uno de los parámetros no es un número"); 
            })
    })
})


describe("API id", () => {
    test("Deberia responder con un 404 ok", async () => {
        const app = await api.build()

        return request(app).get('/api/v1/id/45')
            .expect(404)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((err) => {
                expect(err.body.error).toEqual("No se encontró ninguna entrada de historial con el ID proporcionado");
            })      
    })
})