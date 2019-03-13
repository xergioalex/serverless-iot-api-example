import settings from './data/settings'
import logger from './helpers/logger'
import dynamoService from './lib/dynamoService'


const apiHandlers = {
  hello(request) {
    logger.log('> Processing "HELLO" request...')
    return 'Hey! I am a basic example for iot project api!'
  },

  async led(request) {
    logger.log('> Processing "LED STATE" request...')

    let result = await dynamoService.get('led')
    return result
  },

  async ledOn(request) {
    logger.log('> Processing "LED ON" request...')

    await dynamoService.set('led', 1)
    return { status: '200 OK' }
  },

  async ledOff(request) {
    logger.log('> Processing "LED OFF" request...')

    await dynamoService.set('led', 0)
    return { status: '200 OK' }
  },

  async ledToggle(request) {
    logger.log('> Processing "LED TOGGLE STATE" request...')

    let result = await dynamoService.get('led')
    if (result) {
      let value = (result.Item && typeof result.Item.value === 'number')? ((result.Item.value)? 0:1) : 1
      await dynamoService.set('led', value)
      return { status: '200 OK' }
    } else {
      return { status: '400 NOT GOOD' }
    }
  },

  async handleRequest(request) {
    logger.logInit()
    const result = await apiHandlers[this.event](request)
    logger.logEnd()
    return result
  }
}

export default apiHandlers