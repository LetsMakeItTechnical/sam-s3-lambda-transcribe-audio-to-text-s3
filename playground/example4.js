const AWS = require('aws-sdk');
const { createReadStream } = require('fs');
const { PassThrough } = require('stream');
const marshaller = require('@aws-sdk/eventstream-marshaller'); // for converting binary event stream messages to and from JSON
const util_utf8_node = require('@aws-sdk/util-utf8-node'); // utilities for encoding and decoding UTF8
const mic = require('microphone-stream'); // collect microphone input as a stream of raw bytes
const audioUtils = require('./audioUtils');
var W3CWebSocket = require('websocket').w3cwebsocket;

const kinesis = new AWS.Kinesis({
    region: 'eu-west-1',
    credentials: {
        accessKeyId: '',
        secretAccessKey: '',
    },
});

// export interface PutRecordInput {
//     /**
//      * The name of the stream to put the data record into.
//      */
//     StreamName: StreamName;
//     /**
//      * The data blob to put into the record, which is base64-encoded when the blob is serialized. When the data blob (the payload before base64-encoding) is added to the partition key size, the total size must not exceed the maximum record size (1 MiB).
//      */
//     Data: Data;
//     /**
//      * Determines which shard in the stream the data record is assigned to. Partition keys are Unicode strings with a maximum length limit of 256 characters for each key. Amazon Kinesis Data Streams uses the partition key as input to a hash function that maps the partition key and associated data to a specific shard. Specifically, an MD5 hash function is used to map partition keys to 128-bit integer values and to map associated data records to shards. As a result of this hashing mechanism, all data records with the same partition key map to the same shard within the stream.
//      */
//     PartitionKey: PartitionKey;
//     /**
//      * The hash value used to explicitly determine the shard the data record is assigned to by overriding the partition key hash.
//      */
//     ExplicitHashKey?: HashKey;
//     /**
//      * Guarantees strictly increasing sequence numbers, for puts from the same client and to the same partition key. Usage: set the SequenceNumberForOrdering of record n to the sequence number of record n-1 (as returned in the result when putting record n-1). If this parameter is not set, records are coarsely ordered based on arrival time.
//      */
//     SequenceNumberForOrdering?: SequenceNumber;
//   }

// our converter between binary event streams messages and JSON
const eventStreamMarshaller = new marshaller.EventStreamMarshaller(util_utf8_node.toUtf8, util_utf8_node.fromUtf8);
// wss://pl5e7gxyqa.execute-api.eu-west-1.amazonaws.com/Prod
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
        body: buffer,
    };
}
// react-media-recorder
// https://github.com/0x006F/react-media-recorder/issues/82

// https://www.createit.com/blog/speech-to-text-streaming-demo-in-react/
const client = new W3CWebSocket('wss://s2sevgdzbk.execute-api.eu-west-1.amazonaws.com/Prod');

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

(async function () {
    try {
        const audioSource = createReadStream('ghfhgh.mp4')

        const steamData = await kinesis
            .putRecord({
                StreamName: 'websocket-stack-test-EventStream-d1UWD2vmliOk',
                Data: convertAudioToBinaryMessage(audioSource),
                PartitionKey: 'ddsnjj',
            })
            .promise();

        console.log('----00----');
        console.log(convertAudioToBinaryMessage(audioSource));
        console.log('====00====');
        process.exit(1)
    } catch (error) {
        console.log('----error----');
        console.log(JSON.stringify(error));
        console.log('====error====');
    }
})();

const data = new ArrayBuffer(Buffer.from("AAAAPwAAAC/tgs1nDTptZXNzYWdlLXR5cGUHAAVldmVudAs6ZXZlbnQtdHlwZQcACkF1ZGlvRXZlbnSywdE1"));
const view = new DataView(data);
// "AAAAPwAAAC/tgs1nDTptZXNzYWdlLXR5cGUHAAVldmVudAs6ZXZlbnQtdHlwZQcACkF1ZGlvRXZlbnSywdE1"
console.log('----data----');
console.log(eventStreamMarshaller.unmarshall(view));
console.log('====data====');
