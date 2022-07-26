var W3CWebSocket = require('websocket').w3cwebsocket;
const { createReadStream } = require('fs');
const { PassThrough } = require('stream');
const marshaller = require('@aws-sdk/eventstream-marshaller'); // for converting binary event stream messages to and from JSON
const util_utf8_node = require('@aws-sdk/util-utf8-node'); // utilities for encoding and decoding UTF8
const mic = require('microphone-stream'); // collect microphone input as a stream of raw bytes
const audioUtils = require('./audioUtils');

// our converter between binary event streams messages and JSON
const eventStreamMarshaller = new marshaller.EventStreamMarshaller(util_utf8_node.toUtf8, util_utf8_node.fromUtf8);

function getAudioEventMessage(buffer) {
    // wrap the audio data in a JSON envelope
    return {
        headers: {
            ':message-type': {
                type: 'string',
                value: 'event',
            },
            ':event-type': {
                type: 'string',
                value: 'AudioEvent',
            },
        },

        action: 'sendmessage',
        data: buffer,
        body: buffer,
    };
}
// react-media-recorder
// https://github.com/0x006F/react-media-recorder/issues/82
// https://www.createit.com/blog/speech-to-text-streaming-demo-in-react/

const client = new W3CWebSocket('wss://pl5e7gxyqa.execute-api.eu-west-1.amazonaws.com/Prod');

function convertAudioToBinaryMessage(audioChunk) {
    let raw = mic.toRaw(audioChunk);

    if (raw == null) return;

    // downsample and convert the raw audio bytes to PCM
    let downsampledBuffer = audioUtils.downsampleBuffer(raw);
    let pcmEncodedBuffer = audioUtils.pcmEncode(downsampledBuffer);

    // add the right JSON headers and structure to the message
    let audioEventMessage = getAudioEventMessage(Buffer.from(pcmEncodedBuffer));

    //convert the JSON object + headers into a binary event stream message
    let binary = eventStreamMarshaller.marshall(audioEventMessage);

    return binary;
}

const audioSource = createReadStream('ghfhgh.mp4');
// const audioPayloadStream = new PassThrough({ highWaterMark: 1 * 1024 }); // Stream chunk less than 1 KB
// audioSource.pipe(audioPayloadStream);

// const audioStream = async function* () {
//     for await (const payloadChunk of audioPayloadStream) {
//         yield { AudioEvent: { AudioChunk: payloadChunk } };
//     }
// };

// wss.on('connection', function connection(ws) {
//     const readStream = fs.createReadStream("audio/audio.mp3");
// readStream.on('data', function(data) { ws.send(data) }) readStream.on('close', function() { ws.close() })
// })
console.log('----00----');
console.log(convertAudioToBinaryMessage(audioSource).buffer.toString('base64'));
console.log('====00====');

client.onerror = function () {
    console.log('Connection Error');
};

client.onopen = function () {
    console.log('WebSocket Client Connected');
    client.send(convertAudioToBinaryMessage(audioSource).buffer.toString('base64'));
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
