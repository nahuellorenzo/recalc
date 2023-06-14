import { Sequelize, DataTypes } from 'sequelize';

const inTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: !inTest,
    storage: inTest ? './db.sqlite3' : './db.sqlite3'
})

export const History = sequelize.define('History', {
    firstArg: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    secondArg: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    result: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    error: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export const Operation = sequelize.define('Operation', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

Operation.hasMany(History)
History.belongsTo(Operation)

export async function createHistoryEntry({ firstArg, secondArg, operationName, result, error }) {
    const operation = await Operation.findOne({
        where: {
            name: operationName
        }
    });

    return History.create({
        firstArg,
        secondArg,
        result,
        OperationId: operation.id,
        error
    })
}

export function createTables() {
    return Promise.all([
        History.sync({ force: true }),
        Operation.sync({ force: true })
    ]);
}

export async function getHistory(operationName = null) {
    try {
        if (operationName) {
            return await History.findAll({
                include: Operation,
                where: {
                    "$Operation.name$": operationName
                }
            });
        } else {
            return await History.findAll({ include: Operation });
        }
    } catch (error) {
        throw new Error('Error al obtener el historial de operaciones: ' + error.message);
    }
}

export function deleteAllHistory() {
    return History.destroy({
        where: {}
    })
}

export function getHistoryEntryById(id) {
    return History.findByPk(id, {
        include: Operation
    });
}