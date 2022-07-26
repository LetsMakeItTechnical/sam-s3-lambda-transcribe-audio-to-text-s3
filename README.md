
# S3 Bucket -> Lambda (AWS Transcribe Audio to Text) -> S3 Bucket

## Description

This is a serverless component that takes uploaded MP3, MP4, WAV, FLAC audio files from one S3 Bucket, then using Lambda and AWS Transcribe converts them to text and uploads to another S3 Bucket as JSON. It contains:

- an Input S3 Bucket that accepts MP3, MP4, WAV, FLAC audio files.

- a Lambda that takes the MP3, MP4, WAV, FLAC audio file from the Input S3 bucket, transcribes it to text and uploads it to the Output bucket

- an Output S3 Bucket that receives Text JSON files.

## Deployment Parameters

This component has one CloudFormation deployment parameter:

- `LanguageCode`, a required parameter, represents the language present in the audio file that the AWS Transcribe should detect. Possible values are:
  - 'en-US'
  - 'es-US'
  - 'en-AU'
  - 'fr-CA'
  - 'en-GB'
  - 'de-DE'
  - 'pt-BR'
  - 'fr-FR'
  - 'it-IT'
  - 'ko-KR'
  - 'es-ES'


**Note:** `.gitignore` contains the `samconfig.toml`, hence make sure backup this file, or modify your .gitignore locally.

## Testing the chat API

To test the WebSocket API, you can use [wscat](https://github.com/websockets/wscat), an open-source command line tool.

1. [Install NPM](https://www.npmjs.com/get-npm).
2. Install wscat:
``` bash
$ npm install -g wscat
```
3. On the console, connect to your published API endpoint by executing the following command:
``` bash
$ wscat -c wss://{YOUR-API-ID}.execute-api.{YOUR-REGION}.amazonaws.com/{STAGE}
```
4. To test the sendMessage function, send a JSON message like the following example. The Lambda function sends it back using the callback URL: 
``` bash

$ wscat -c wss://{YOUR-API-ID}.execute-api.{YOUR-REGION}.amazonaws.com/prod
aws kinesis put-record --stream-name websocket-stack-test-EventStream-L1ud9qazBoYj --partition-key user1 --data "user signup" --cli-binary-format raw-in-base64-out
connected (press CTRL+C to quit)
> {"action":"sendmessage", "data":"hello world"}
< hello world
```

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.

## Latest Release - 1.1.0

- Upgrading to Node.js 14.x LTS

## Roadmap - Upcoming changes

Here are the upcoming changes that I'll add to this serverless component:

- ESLint
- Tests