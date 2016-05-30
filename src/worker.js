import { encodeJSON } from './encoder/midi-file';

// @todo Use ES2015 module syntax if webworkify supports it.
module.exports = (self) => {
    self.addEventListener('message', ({ data: { json } }) => {
        try {
            self.postMessage({
                midiFile: encodeJSON(json)
            });
        } catch (err) {
            self.postMessage({
                err: {
                    message: err.message
                }
            });
        }
    });
};
