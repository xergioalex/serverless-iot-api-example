const settings = {
  DEBUG: process.env.DEBUG,
  ENVIRONMENT: process.env.ENVIRONMENT,
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
  DYNAMODB_ENDPOINT_URL: process.env.DYNAMODB_ENDPOINT_URL
}

if (settings.DYNAMODB_ENDPOINT_URL) {
  settings.AWS_CONFIG = {
    region: process.env.DYNAMODB_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT_URL
  }
}

export default settings