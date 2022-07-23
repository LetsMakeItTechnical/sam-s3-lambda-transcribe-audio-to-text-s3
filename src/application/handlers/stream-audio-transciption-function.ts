// //@ts-nocheck
// import { PassThrough } from 'stream'
// import { createReadStream } from 'fs'
// import {
//   TranscribeStreamingClient,
//   StartStreamTranscriptionCommand,
// } from '@aws-sdk/client-transcribe-streaming'

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

//   const client = new TranscribeStreamingClient({})
//   const command = new StartStreamTranscriptionCommand({
//     LanguageCode: 'en-US',
//     MediaEncoding: 'pcm',
//     MediaSampleRateHertz: 44100,
//     AudioStream: audioStream(),
//   })

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
// "@aws-sdk/client-transcribe-streaming": "^3.128.0",