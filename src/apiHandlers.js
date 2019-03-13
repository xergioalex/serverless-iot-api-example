import settings from './data/settings'
import logger from './helpers/logger'


const apiHandlers = {
  hello(request) {
    logger.log('> Processing "HELLO" request...')
    return 'Hey! I am a basic example for iot project api!'
  },

  async handleRequest(request) {
    logger.logInit()
    const result = await apiHandlers[this.event](request)
    logger.logEnd()
    return result
  }
}

export default apiHandlers