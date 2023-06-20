const { seed } = require('../src/seed.js')
const {
    createHistoryEntry,
    History,
    Operation,
    getHistory,
    deleteAllHistory
} = require('../src/models.js')

beforeEach(async () => {
    await seed()
})

describe("History", () => {
    test("Deberia poder crear una resta en el history", async () => {
        await createHistoryEntry({
            firstArg: 2,
            secondArg: 2,
            result: 0,
            operationName: "SUB"
        })

        const histories = await History.findAll({
            include: [Operation]
        })
        
        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(2)
        expect(histories[0].secondArg).toEqual(2)
        expect(histories[0].result).toEqual(0)
        expect(histories[0].Operation.name).toEqual("SUB")
    })

    test("Deberia poder crear una resta con parametros negativos en el history", async () => {
        await createHistoryEntry({
            firstArg: -2,
            secondArg: -2,
            result: 0,
            operationName: "SUB"
        })

        const histories = await History.findAll({
            include: [Operation]
        })
        
        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(-2)
        expect(histories[0].secondArg).toEqual(-2)
        expect(histories[0].result).toEqual(0)
        expect(histories[0].Operation.name).toEqual("SUB")
    })

    test("Deberia poder guardar el atributo error en el history", async () => {
        await createHistoryEntry({
            firstArg: -2,
            secondArg: 4,
            result: -6,
            operationName: "SUB",
            error: 'Uno de los parámetros no es un número'
        })

        const histories = await History.findAll({
            include: [Operation]
        })
        
        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(-2)
        expect(histories[0].secondArg).toEqual(4)
        expect(histories[0].result).toEqual(-6)
        expect(histories[0].Operation.name).toEqual("SUB")
        expect(histories[0].error).toEqual('Uno de los parámetros no es un número')
    })
})

describe("History", () => {    

    test("Debería retornar todas las operaciones que se realizaron en la Base de Datos con 2 operaciones", async () => {
            await createHistoryEntry({
                firstArg: 2,
                secondArg: 2,
                result: 0,
                operationName: "SUB"
            })
            await createHistoryEntry({
                firstArg: 2,
                secondArg: 2,
                result: 0,
                operationName: "SUB"
            })
        const histories = await History.findAll();

        expect(histories.length).toEqual(2)
    })


    test("Debería retornar todas las operaciones que se realizaron en la Base de Datos con 0 operaciones", async () => {
        const histories = await History.findAll();

        expect(histories.length).toEqual(0)
        })
})

describe("History", () => {    

    test("Debería retornar que se borraron los datos en la Base de Datos", async () => {
            await createHistoryEntry({
                firstArg: 2,
                secondArg: 2,
                result: 0,
                operationName: "SUB"
            })
            await createHistoryEntry({
                firstArg: 2,
                secondArg: 2,
                result: 0,
                operationName: "SUB"
            })

        const historiesdeleted = await deleteAllHistory();
        const histories = await getHistory();

        expect(historiesdeleted).toEqual(2)
        expect(histories.length).toEqual(0)

    })
}) 