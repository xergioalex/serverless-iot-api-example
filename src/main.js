import ApiBuilder from 'claudia-api-builder'
import apiHandlers from './apiHandlers'


const api = new ApiBuilder()

api.get('/hello', apiHandlers.handleRequest.bind({ event: 'hello' }))
api.get('/led', apiHandlers.handleRequest.bind({ event: 'led' }))
api.get('/led-toggle', apiHandlers.handleRequest.bind({ event: 'ledToggle' }))

module.exports = api