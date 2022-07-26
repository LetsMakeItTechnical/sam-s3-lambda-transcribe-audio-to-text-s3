// //@ts-nocheck
// import { PassThrough } from 'stream'
// import { createReadStream } from 'fs'
// import {
//   TranscribeStreamingClient,
//   StartStreamTranscriptionCommand,
// } from '@aws-sdk/client-transcribe-streaming'

import { KinesisStreamEvent } from 'aws-lambda';
// import AWS from 'aws-sdk';
import marshaller = require('@aws-sdk/eventstream-marshaller'); // for converting binary event stream messages to and from JSON
import util_utf8_node = require('@aws-sdk/util-utf8-node'); // uti

const eventStreamMarshaller = new marshaller.EventStreamMarshaller(util_utf8_node.toUtf8, util_utf8_node.fromUtf8);
// const audioSource = createReadStream('ghfhgh.mp4')

// const audioPayloadStream = new PassThrough({ highWaterMark: 1 * 1024 }) // Stream chunk less than 1 KB
// audioSource.pipe(audioPayloadStream)

// const audioStream = async function* () {
//   for await (const payloadChunk of audioPayloadStream) {
//     yield { AudioEvent: { AudioChunk: payloadChunk } }
//   }
// }

// export const lambdaHandler = async function (
//   event: S3Event,
//   context: Context
// ): Promise<void> {
//   console.log('----00----');
//   console.log(JSON.stringify(event));
//   console.log('====00====');

//   const client = new TranscribeStreamingClient({})
//   const command = new StartStreamTranscriptionCommand({
//     LanguageCode: 'en-US',
//     MediaEncoding: 'pcm',
//     MediaSampleRateHertz: 44100,
//     AudioStream: audioStream(),
//   });

//   try {
//     const response = await client.send(command)

//     // This snippet should be put into an async function
//     for await (const event of response?.TranscriptResultStream) {
//       if (event.TranscriptEvent) {
//         const message = event.TranscriptEvent
//         // Get multiple possible results
//         const results = event.TranscriptEvent.Transcript.Results
//         // Print all the possible transcripts
//         results.map((result) => {
//           ;(result.Alternatives || []).map((alternative) => {
//             const transcript = alternative.Items.map(
//               (item) => item.Content
//             ).join(' ')
//             console.log(transcript)
//           })
//         })
//       }
//     }
//   } catch (err) {
//     const error = err as AppError

//     error.statusCode =
//       error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
//     error.status = error.status || 'error'

//     logger.info('----00----')
//     console.log(error)
//     logger.error(error)
//     logger.error(JSON.stringify(error))
//     logger.info('====00====')
//   }
// }

export const lambdaHandler = async function (event: KinesisStreamEvent): Promise<void> {
    console.log('----00----');
    console.log(JSON.stringify(event));
    console.log('====00====');

    // const api = new AWS.ApiGatewayManagementApi({
    //     apiVersion: '2018-11-29',
    //     endpoint: 'wss://ud09txo6yi.execute-api.eu-west-1.amazonaws.com/Prod',
    // });

    for (let r in event.Records) {
        // const data = JSON.parse(new Buffer(event.Records[r].kinesis.data, 'base64').toString());
        //@ts-ignore
        const data = eventStreamMarshaller.unmarshall(new Buffer(event.Records[r].kinesis.data))
        console.log('----data----');
        console.log(data);
        console.log('====data====');
        try {
            // await api
            //     .postToConnection({
            //         ConnectionId: data.connectionId,
            //         Data: JSON.stringify(data.payload),
            //     })
            //     .promise();
        } catch (e: any) {
            if (e.statusCode === 410) {
                console.log('client disconnected');
            } else {
                throw e;
            }
        }
    }
};
