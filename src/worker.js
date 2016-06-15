import { encodeJSON } from './encoder/midi-file';

export default (self) => {
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
