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

  async ledToggle(request) {
    logger.log('> Processing "LED TOGGLE STATE" request...')

    let result = await dynamoService.get('led')
    if (result) {
      await dynamoService.set('led', !result.Item.value)
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