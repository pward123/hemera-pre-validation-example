'use strict'

const Joi = require('joi')

const topic = 'math'
const addCmd = 'add'

const schemas = {
    addArgs: Joi.object({
        a: Joi.number().required(),
        b: Joi.number().required(),
    }).required(),

    addResponse: Joi.number().required(),
}

const add = (args) => {
    const {a, b} = Joi.attempt(args, schemas.addArgs)
    return {
        topic,
        cmd: addCmd,
        a,
        b,
    }
}

const addSvc = () => ({
    topic,
    cmd: addCmd,
    joi$: {
        pre : schemas.addArgs,
        post: schemas.addResponse,
    },
})

module.exports = {
    add,
    addSvc,
}
