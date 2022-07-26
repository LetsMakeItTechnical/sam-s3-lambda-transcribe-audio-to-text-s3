import AWS = require('aws-sdk')
import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda'
import { DeleteItemInput } from 'aws-sdk/clients/dynamodb'

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
})

export const lambdaHandler = async function (event: APIGatewayProxyWebsocketEventV2) {
  const deleteParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      connectionId: event.requestContext.connectionId,
    },
  } as DeleteItemInput

  try {
    await ddb.delete(deleteParams).promise()
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Failed to disconnect: ' + JSON.stringify(err),
    }
  }

  return { statusCode: 200, body: 'Disconnected.' }
}
