import AWS from 'aws-sdk'
import settings from '../data/settings'
import logger from '../helpers/logger'

AWS.config.update(settings.AWS_CONFIG)

let dynamoDb = new AWS.DynamoDB.DocumentClient()
let baseParams = {
  TableName: settings.DYNAMODB_TABLE_NAME
}

let dynamoService = {
  async get(key) {
    let params = baseParams
    params['Key'] = { device: key }
    console.log(params)
    let data = await dynamoDb.get(params,  (err, data) => {
      if (err) {
        logger.log(err)
      }
    }).promise()
    return data
  },

  async set(key, value) {
    let params = baseParams
    params['Item'] = { device: key, value: value }
    return await dynamoDb.put(params).promise()
  }
}

export default dynamoService