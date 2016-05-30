const _encodeEvent = (event) => {
    var arrayBuffer,
        dataView;

    if ('channelPrefix' in event) {
        arrayBuffer = new ArrayBuffer(4);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x20); // metaTypeByte
        dataView.setUint8(2, 1);
        dataView.setUint8(3, event.channelPrefix);

        return arrayBuffer;
    }

    if ('controlChange' in event) {
        arrayBuffer = new ArrayBuffer(3);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xB0 | (event.channel & 0xF)); // eslint-disable-line no-bitwise
        dataView.setUint8(1, event.controlChange.type);
        dataView.setUint8(2, event.controlChange.value);

        return arrayBuffer;
    }

    if ('endOfTrack' in event) {
        arrayBuffer = new ArrayBuffer(3);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x2F); // metaTypeByte
        dataView.setUint8(2, 0);

        return arrayBuffer;
    }

    if ('keySignature' in event) {
        arrayBuffer = new ArrayBuffer(5);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x59); // metaTypeByte
        dataView.setUint8(2, 2);
        dataView.setUint8(3, event.keySignature.key);
        dataView.setUint8(4, event.keySignature.scale);

        return arrayBuffer;
    }

    if ('midiPort' in event) {
        arrayBuffer = new ArrayBuffer(4);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x21); // metaTypeByte
        dataView.setUint8(2, 1);
        dataView.setUint8(3, event.midiPort);

        return arrayBuffer;
    }

    if ('noteOff' in event) {
        arrayBuffer = new ArrayBuffer(3);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0x80 | (event.channel & 0xF)); // eslint-disable-line no-bitwise
        dataView.setUint8(1, event.noteOff.noteNumber);
        dataView.setUint8(2, event.noteOff.velocity);

        return arrayBuffer;
    }

    if ('noteOn' in event) {
        arrayBuffer = new ArrayBuffer(3);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0x90 | (event.channel & 0xF)); // eslint-disable-line no-bitwise
        dataView.setUint8(1, event.noteOn.noteNumber);
        dataView.setUint8(2, event.noteOn.velocity);

        return arrayBuffer;
    }

    if ('pitchBend' in event) {
        arrayBuffer = new ArrayBuffer(3);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xE0 | (event.channel & 0xF)); // eslint-disable-line no-bitwise
        dataView.setUint8(1, event.pitchBend & 0x7F); // eslint-disable-line no-bitwise
        dataView.setUint8(2, event.pitchBend >> 7); // eslint-disable-line no-bitwise

        return arrayBuffer;
    }

    if ('programChange' in event) {
        arrayBuffer = new ArrayBuffer(2);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xC0 | (event.channel & 0xF)); // eslint-disable-line no-bitwise
        dataView.setUint8(1, event.programChange.programNumber);

        return arrayBuffer;
    }

    if ('setTempo' in event) {
        arrayBuffer = new ArrayBuffer(6);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x51); // metaTypeByte
        dataView.setUint8(2, 3);
        dataView.setUint8(3, event.setTempo.microsecondsPerBeat >> 16); // eslint-disable-line no-bitwise
        dataView.setUint8(4, event.setTempo.microsecondsPerBeat >> 8); // eslint-disable-line no-bitwise
        dataView.setUint8(5, event.setTempo.microsecondsPerBeat);

        return arrayBuffer;
    }

    if ('smpteOffset' in event) {
        let frameRateByte;

        arrayBuffer = new ArrayBuffer(8);
        dataView = new DataView(arrayBuffer);

        if (event.smpteOffset.frameRate === 24) {
            frameRateByte = 0x00;
        } else if (event.smpteOffset.frameRate === 25) {
            frameRateByte = 0x20;
        } else if (event.smpteOffset.frameRate === 29) {
            frameRateByte = 0x40;
        } else if (event.smpteOffset.frameRate === 30) {
            frameRateByte = 0x60;
        }

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x54); // metaTypeByte
        dataView.setUint8(2, 5);
        dataView.setUint8(3, event.smpteOffset.hour | frameRateByte); // eslint-disable-line no-bitwise
        dataView.setUint8(4, event.smpteOffset.minutes);
        dataView.setUint8(5, event.smpteOffset.seconds);
        dataView.setUint8(6, event.smpteOffset.frame);
        dataView.setUint8(7, event.smpteOffset.subFrame);

        return arrayBuffer;
    }

    if ('sysex' in event) {
        let sysexArrayBuffer,
            sysexLength;

        arrayBuffer = new ArrayBuffer(1);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xF0); // eventTypeByte

        sysexLength = _writeVariableLengthQuantity(event.sysex.length / 2);
        sysexArrayBuffer = new ArrayBuffer(event.sysex.length / 2);
        dataView = new DataView(sysexArrayBuffer);

        for (let i = 0; i < event.sysex.length; i += 2) {
            dataView.setUint8(i / 2, parseInt(event.sysex.slice(i, i + 2), 16));
        }

        return _joinArrayBuffers([ arrayBuffer, sysexLength, sysexArrayBuffer ]);
    }

    if ('timeSignature' in event) {
        let counter,
            denominator;

        arrayBuffer = new ArrayBuffer(7);
        dataView = new DataView(arrayBuffer);

        denominator = event.timeSignature.denominator;
        counter = 0;

        while (denominator > 1) {
            denominator /= 2;
            counter += 1;
        }

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x58); // metaTypeByte
        dataView.setUint8(2, 4);
        dataView.setUint8(3, event.timeSignature.numerator);
        dataView.setUint8(4, counter);
        dataView.setUint8(5, event.timeSignature.metronome);
        dataView.setUint8(6, event.timeSignature.thirtyseconds);

        return arrayBuffer;
    }

    if ('trackName' in event) {
        let textArrayBuffer,
            textEncoder,
            textLength

        arrayBuffer = new ArrayBuffer(2);
        dataView = new DataView(arrayBuffer);

        dataView.setUint8(0, 0xFF); // eventTypeByte
        dataView.setUint8(1, 0x03); // metaTypeByte

        textEncoder = new TextEncoder(); // eslint-disable-line no-undef
        textArrayBuffer = textEncoder.encode(event.trackName).buffer;
        textLength = _writeVariableLengthQuantity(textArrayBuffer.byteLength);

        return _joinArrayBuffers([ arrayBuffer, textLength, textArrayBuffer ]);
    }

    throw new Error(`Unencodable event with a delta of "${ event.delta }".`);
};

const _encodeHeaderChunk = (division, format, tracks) => {
    var arrayBuffer,
        dataView;

    arrayBuffer = new ArrayBuffer(14);
    dataView = new DataView(arrayBuffer);

    dataView.setUint32(0, 1297377380); // MThd
    dataView.setUint32(4, 6);
    dataView.setUint16(8, format);
    dataView.setUint16(10, tracks.length);
    dataView.setUint16(12, division);

    return arrayBuffer;
};

export const encodeJSON = ({ division, format, tracks }) => {
    var arrayBuffers = [];

    try {
        arrayBuffers.push(_encodeHeaderChunk(division, format, tracks));
    } catch (err) {
        throw new Error('The given JSON object seems to be invalid.');
    }

    for (let track of tracks) {
        try {
            arrayBuffers.push(_encodeTrackChunk(track));
        } catch (err) {
            if (err.message.match(/Unencodable\sevent\sat\sposition\s[0-9]+\./)) {
                let index = tracks.indexOf(track);

                throw new Error(`${ err.message.slice(0, -1) } of the track at index ${ index }.`);
            }

            throw err;
        }
    }

    return _joinArrayBuffers(arrayBuffers);
};

const _encodeTrackChunk = (track) => {
    var arrayBuffers,
        byteLength,
        dataView;

    arrayBuffers = [ new ArrayBuffer(8) ];
    byteLength = 0;
    dataView = new DataView(arrayBuffers[0]);

    dataView.setUint32(0, 1297379947); // MTrk

    for (let event of track) {
        let deltaArrayBuffer,
            eventArrayBuffer;

        deltaArrayBuffer = _writeVariableLengthQuantity(event.delta);

        try {
            eventArrayBuffer = _encodeEvent(event);
        } catch (err) {
            if (err.message.match(/Unencodable\sevent\swith\sa\sdelta\sof\s[0-9]+\./)) {
                let index = track.indexOf(event);

                throw new Error(`Unencodable event at index ${ index }.`);
            }

            throw err;
        }

        byteLength += deltaArrayBuffer.byteLength + eventArrayBuffer.byteLength;

        arrayBuffers.push(deltaArrayBuffer);
        arrayBuffers.push(eventArrayBuffer);
    }

    dataView.setUint32(4, byteLength);

    return _joinArrayBuffers(arrayBuffers);
};

const _joinArrayBuffers = (arrayBuffers) => {
    var byteLength,
        uint8Array;

    byteLength = arrayBuffers.reduce((byteLength, arrayBuffer) => byteLength + arrayBuffer.byteLength, 0);

    ([ , uint8Array ] = arrayBuffers.reduce(([ offset, uint8Array ], arrayBuffer) => {
        uint8Array.set(new Uint8Array(arrayBuffer), offset);

        return [ offset + arrayBuffer.byteLength, uint8Array ];
    }, [ 0, new Uint8Array(byteLength) ]));

    return uint8Array.buffer;
};

const _writeVariableLengthQuantity = (value) => {
    var numberOfBytes = 1,
        uint8Array;

    while (Math.pow(2, numberOfBytes * 7) - 1 < value) {
        numberOfBytes += 1
    }

    uint8Array = new Uint8Array(numberOfBytes);

    for (let i = 0; value >> 7; i += 1) { // eslint-disable-line no-bitwise
        uint8Array[i] = value >> 7 | 0x80; // eslint-disable-line no-bitwise
        value &= 0x7F; // eslint-disable-line no-bitwise
    }

    uint8Array[numberOfBytes - 1] = value;

    return uint8Array.buffer;
};
