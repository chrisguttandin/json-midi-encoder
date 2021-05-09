# json-midi-encoder

**This module encodes a JSON representation of MIDI data into a binary MIDI file.**

[![dependencies](https://img.shields.io/david/chrisguttandin/json-midi-encoder.svg?style=flat-square)](https://www.npmjs.com/package/json-midi-encoder)
[![version](https://img.shields.io/npm/v/json-midi-encoder.svg?style=flat-square)](https://www.npmjs.com/package/json-midi-encoder)

By using this module it is possible to encode a JSON representation of a MIDI file into its binary
counterpart. That JSON representation can either be created from scratch or produced by parsing an
existing file with the [midi-json-parser](https://github.com/chrisguttandin/midi-json-parser).

## Usage

This module is distributed as package on [npm](https://www.npmjs.com/package/json-midi-encoder). It
can be installed by running the following command:

```shell
npm install json-midi-encoder
```

The only exported function is called `encode()`. It expects to receive a JSON representation as its
only parameter. It returns a Promise which hopefully resolves with an ArrayBuffer containing the
binary MIDI file. Here is a little example.

```js
import { encode } from 'json-midi-encoder';

const json = {
    division: 480,
    format: 1,
    tracks: [
        [
            {
                delta: 0,
                trackName: 'example'
            },
            // ... there are probably more events ...
            {
                delta: 0,
                endOfTrack: true
            }
        ]
        // ... maybe there are more tracks ...
    ]
};

encode(json).then((midiFile) => {
    // midiFile is an ArrayBuffer containing the binary data.
});
```

To see what kind of events this module can handle, you may want to have a look at the
[JSON files](https://github.com/chrisguttandin/json-midi-encoder/tree/master/test/fixtures) used
to test this module. There is also a
[TypeScript interface](https://github.com/chrisguttandin/midi-json-parser-worker/blob/master/src/interfaces/midi-file.ts)
which describes the JSON representation.
