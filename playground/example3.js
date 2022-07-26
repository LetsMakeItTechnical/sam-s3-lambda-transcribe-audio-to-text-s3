const { PassThrough } = require('stream');
var W3CWebSocket = require('websocket').w3cwebsocket;
const { createReadStream } = require('fs');
const { StartStreamTranscriptionCommand } = require('@aws-sdk/client-transcribe-streaming');
const client = new W3CWebSocket('wss://ud09txo6yi.execute-api.eu-west-1.amazonaws.com/Prod');
const audioSource = createReadStream('ghfhgh.mp4', {
    flags: 'r',
    encoding: 'binary',
    mode: 0666,
    bufferSize: 64 * 1024,
});

console.log('----00----');
console.log(audioSource);
console.log('====00====');
// const audioPayloadStream = new PassThrough({ highWaterMark: 1 * 1024 }); // Stream chunk less than 1 KB
// audioSource.pipe(audioPayloadStream);

// const audioStream = async function* () {
//     for await (const payloadChunk of audioPayloadStream) {
//         yield { AudioEvent: { AudioChunk: payloadChunk } };
//     }
// };

// const command = new StartStreamTranscriptionCommand({
//     LanguageCode: 'en-US',
//     MediaEncoding: 'pcm',
//     MediaSampleRateHertz: 44100,
//     AudioStream: audioStream(),
// });
// https://blog.ldtalentwork.com/2021/05/09/aws-kinesis-video-stream-with-signed-url/
client.onerror = function () {
    console.log('Connection Error');
};

client.onopen = function () {
    console.log('WebSocket Client Connected');
    // TextEncoder
    const buffer = new ArrayBuffer(8);
    const view = new Int32Array(buffer);
    client.send(JSON.stringify({ action: 'default', data: `Buffer.from("SGVsbG8gVmlzaGFsIFRoYWt1cg==", 'base64') ` }));
};

client.onclose = function () {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function (e) {
    console.log("Received: '" + e);
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};
