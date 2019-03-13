import ApiBuilder from 'claudia-api-builder'
import apiHandlers from './apiHandlers'


const api = new ApiBuilder()

api.get('/hello', apiHandlers.handleRequest.bind({ event: 'hello' }))

module.exports = api
