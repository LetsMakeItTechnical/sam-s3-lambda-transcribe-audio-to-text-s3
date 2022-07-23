//@ts-nocheck

import {
  StartStreamTranscriptionCommand,
  TranscribeStreamingClient,
} from '@aws-sdk/client-transcribe-streaming'
import { createReadStream } from 'fs'
import { PassThrough } from 'stream'

const client = new TranscribeStreamingClient({})
const command = new StartStreamTranscriptionCommand({
  LanguageCode: 'en-US',
  MediaEncoding: 'pcm',
  MediaSampleRateHertz: 44100,
  AudioStream: audioStream(),
})

const audioSource = createReadStream('ghfhgh.mp4')
const audioPayloadStream = new PassThrough({ highWaterMark: 1 * 1024 }) // Stream chunk less than 1 KB
audioSource.pipe(audioPayloadStream)
const audioStream = async function* () {
  for await (const payloadChunk of audioPayloadStream) {
    yield { AudioEvent: { AudioChunk: payloadChunk } }
  }
}
// StartStreamTranscriptionCommandOutput
async function transcribeAudio() {
  const response = await client.send(command)

  if (!Array.isArray(response?.TranscriptResultStream)) return

  // This snippet should be put into an async function
  for await (const event of response?.TranscriptResultStream) {
    if (event.TranscriptEvent) {
      const message = event.TranscriptEvent
      // Get multiple possible results
      const results = event?.TranscriptEvent?.Transcript.Results
      // Print all the possible transcripts
      results?.map((result) => {
        ;(result.Alternatives || []).map((alternative) => {
          const transcript = alternative?.Items.map(
            (item) => item.Content
          ).join(' ')

          console.log(transcript)
        })
      })
    }
  }
}

transcribeAudio()
