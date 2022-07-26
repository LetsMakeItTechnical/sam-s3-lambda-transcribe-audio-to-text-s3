import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import AWS from 'aws-sdk';
import { PutItemInput } from 'aws-sdk/clients/dynamodb';

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

export const lambdaHandler = async function (event: APIGatewayProxyWebsocketEventV2) {
    console.log('----00----');
    console.log(JSON.stringify(event));
    console.log('====00====');
    const putParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            connectionId: event.requestContext.connectionId,
        },
    } as PutItemInput;

    try {
        await ddb.put(putParams).promise();
    } catch (err) {
        return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
    }

    return { statusCode: 200, body: 'Connected.' };
};
