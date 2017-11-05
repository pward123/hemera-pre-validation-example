'use strict'

/* eslint-disable global-require */
require('dotenv').config()

const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const nats = require('nats').connect(process.env.NATS_SERVERS || '')
const {add, addSvc} = require('./client')

const hemeraLogLevel = process.env.HEMERA_LOG_LEVEL || 'info'
console.log('setting hemera log level to', hemeraLogLevel)
const hemera = new Hemera(nats, {
    logLevel : hemeraLogLevel,
    // prettyLog: false,
})

hemera.setOption('payloadValidator', 'hemera-joi')
hemera.use(HemeraJoi)

hemera.ready(async () => {
  let Joi = hemera.joi

  hemera.log.info('Creating math.add service')
  hemera.add(addSvc(), async ({a, b}) => {
    if (a + b > 10) {
      return 'a'
    }
    return a + b
  })

  hemera.log.info('calling math.add using the contract')
  let result = await hemera.act(add({a: 1, b: 2}))
  hemera.log.info('add result =', result)

  const which = 1

  switch (which) {
    case 1:
      hemera.log.info('prevalidation failure using contract')
      try {
        result = await hemera.act(add({a: 1, b: 'a'}))
        hemera.log.error('We\'re expecting an exception here')
      } catch (e) {
        console.log('====', e.stack)
      }
      break

    case 2:
      hemera.log.info('prevalidation failure without contract')
      try {
        result = await hemera.act({
          topic: 'math',
          cmd  : 'add',
          a    : 1,
          b    : 'a',
        })
      } catch (e) {
        console.log('====', e.stack)
      }
      break

    case 3:
      try {
        result = await hemera.act({
          topic: 'math',
          cmd  : 'add',
          a    : 10,
          b    : 1,
        })
      } catch (e) {
        console.log('====', e.stack)
      }
      break

    default:
      console.error('Invalid \'which\' value')
      process.exit(1)
  }
})
