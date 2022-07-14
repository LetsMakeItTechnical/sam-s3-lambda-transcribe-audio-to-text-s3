import { S3Event, Context } from 'aws-lambda'
import { AppError } from '../../utils/appError'
import { HTTP_STATUS_CODE } from '../../utils/HttpClient/http-status-codes'
import logger from '../services/logging'
import AWS from 'aws-sdk'
import { StartTranscriptionJobResponse } from 'aws-sdk/clients/transcribeservice'

export const lambdaHandler = async function (
  event: S3Event,
  context: Context
): Promise<StartTranscriptionJobResponse> {
  const transcribe = new AWS.TranscribeService()
  const path = require('path')
  const LANGUAGE_CODE = process.env.LANGUAGE_CODE
  const OUTPUT_BUCKET = process.env.OUTPUT_BUCKET

  const eventRecord = event.Records && event.Records[0]
  const inputBucket = eventRecord.s3.bucket.name
  const key = eventRecord.s3.object.key
  const id = context.awsRequestId

  const fileUri = `https://${inputBucket}.s3.amazonaws.com/${key}`
  const jobName = `s3-lambda-audio-transcribe-${id}`


  try {
    let extension = path.extname(key)
    extension = extension.substr(1, extension.length)

    console.log(
      'converting from ',
      `https://${inputBucket}.s3.amazonaws.com/${key}`,
      extension
    )

    if (!['mp3', 'mp4', 'wav', 'flac'].includes(extension)) {
      throw 'Invalid file extension, the only supported AWS Transcribe file types are MP3, MP4, WAV, FLAC.'
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
    logger.error('register', error)
    error.statusCode =
      error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    error.status = error.status || 'error'
    console.log('----00----')
    console.log(JSON.stringify(error))
    console.log('====00====')
    return {}
  }
}
