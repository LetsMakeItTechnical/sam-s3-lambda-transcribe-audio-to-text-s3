import { S3Event, Context } from 'aws-lambda'
// import { StartTranscriptionJobResponse } from 'aws-sdk/clients/transcribeservice'
import { HTTP_STATUS_CODE } from '../../utils/HttpClient/http-status-codes'
import logger from '../services/logging'
import AWS from 'aws-sdk'
import AppError from '../../utils/responses/error/AppError'
// import { TranscribeStreamingClient, TranscriptResultStream, TranscriptEvent } from '@aws-sdk/client-transcribe-streaming'
// https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-transcribe-streaming

function streamToString (stream: any) {
  const chunks = [] as any[];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err: any) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

function decodeString(str: string): string {
  // For some reason this has to be decoded twice to properly parse the equal (=) sign
  return decodeURIComponent(
    JSON.parse(`"${str.replace(/\"/g, '\\"')}"`)
  ).replace(/\+/g, ' ')
}

// https://stackoverflow.com/questions/68549572/npm-install-in-github-actions-failed

export const lambdaHandler = async function (
  event: S3Event,
  context: Context
): Promise<any> {
  const transcribe = new AWS.TranscribeService()
// AWS.TranscribeStreamingClient 
// new TranscribeStreamingClient({}).config()
  const path = require('path')
  const LANGUAGE_CODE = process.env?.LANGUAGE_CODE
  const OUTPUT_BUCKET = process.env.OUTPUT_BUCKET

  const eventRecord = event.Records && event.Records[0]
  const inputBucket = eventRecord.s3.bucket.name
  const key = decodeString(eventRecord.s3.object.key)

  const id = context.awsRequestId

  const fileUri = `https://s3-us-west-2.amazonaws.com/${inputBucket}/${key}`
  const jobName = `s3-lambda-audio-transcribe-${id}`

  try {
    let extension = path.extname(key)
    extension = extension.substr(1, extension.length)

    logger.info('converting from ', { fileUri, extension })

    if (
      !['amr', 'flac', 'wav', 'ogg', 'mp3', 'mp4', 'webm'].includes(extension)
    ) {
      const message =
        'Invalid file extension, the only supported AWS Transcribe file types are MP3, MP4, WAV, FLAC.'
      logger.error(message)
      throw new AppError(message, HTTP_STATUS_CODE.BAD_REQUEST)
    }

    const params = {
      LanguageCode: LANGUAGE_CODE,
      Media: {
        MediaFileUri: fileUri,
      },
      MediaFormat: extension,
      TranscriptionJobName: jobName,
      OutputBucketName: OUTPUT_BUCKET,
    }

    return transcribe.startTranscriptionJob(params).promise()
  } catch (err) {
    const error = err as AppError

    error.statusCode =
      error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    error.status = error.status || 'error'

    logger.info('----00----')
    console.log(error)
    logger.error(error)
    logger.error(JSON.stringify(error))
    logger.info('====00====')

    return {}
  }
}
