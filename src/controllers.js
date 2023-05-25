import express from 'express';
import core from './core.js';

import { createHistoryEntry, deleteAllHistory, getHistory, getHistoryEntryById} from "./models.js";

const router = express.Router();

router.get("/sub/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send('Uno de los parámetros no es un número');
    } else {
        const result = core.sub(a, b);

        await createHistoryEntry({ firstArg: a, secondArg: b, result, operationName: "SUB", error: null })
        return res.send({ result });
    }
});

router.get("/add/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send({ "error": 'Uno de los parámetros no es un número' });
    } else {
        const result = core.add(a, b);

        await createHistoryEntry({ firstArg: a, secondArg: b, result, operationName: "ADD", error: null })
        return res.send({ result });
    }
});


router.get("/pow/:a", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);

    if (isNaN(a)) {
        res.status(400).send({ "error": 'Uno de los parámetros no es un número' });
    } else {
        const result = core.pow(a);

        await createHistoryEntry({ firstArg: a, secondArg: null, result, operationName: "POW", error: null })
        return res.send({ result });
    }
});


router.get("/div/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send({ "error": 'Uno de los parámetros no es un número' });
    } else {
        const result = core.div(a, b);
        return res.send({ result });
    }
});

router.get("/mul/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send({ "error": 'Uno de los parámetros no es un número' });
    } else {
        const result = core.mul(a, b);

        await createHistoryEntry({ firstArg: a, secondArg: b, result, operationName: "MUL", error: null })
        return res.send({ result });
    }
});

router.get("/all", async function (req, res) {
    const result = getHistory()
        .then((resp) => res.send({ resp }))
        .catch((error) => res.status(400).send({ error }));

    return result;
});

router.get("/allDeleted", async function (req, res) {
    try {
        const rowsDeleted = await deleteAllHistory();
        console.log(`${rowsDeleted} registros eliminados de la tabla History.`);
        res.status(200).send({"result":`${rowsDeleted} registros eliminados de la tabla History.`});
    } catch (error) {
        console.error('Error al eliminar los registros de History:', error);
        res.status(500).send({"result":'Error al eliminar los registros de History.'});
    }
});

router.get("/id/:id", async function (req, res) {
    const id = req.params.id;

    try {
        const result = await getHistoryEntryById(id);

        if (!result) {
            return res.status(404).send({ error: 'No se encontró ninguna entrada de historial con el ID proporcionado' });
        }

        return res.send({ result });
    } catch (error) {
        console.error('Error al obtener la entrada del historial:', error);
        return res.status(500).send({ error: 'Error al obtener la entrada del historial' });
    }
});

    export default router;