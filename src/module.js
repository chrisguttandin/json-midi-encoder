import midiFileEncoderWorker from './worker';
import webworkify from 'webworkify';

const worker = webworkify(midiFileEncoderWorker);

export const encodeJSON = (json) => {
    return new Promise((resolve, reject) => {
        /* eslint-disable indent */
        const onMessage = ({ data }) => {
                  worker.removeEventListener('message', onMessage);

                  if ('midiFile' in data) {
                      resolve(data.midiFile);
                  } else {
                      reject(new Error(data.err.message));
                  }
              };
        /* eslint-enable indent */

        worker.addEventListener('message', onMessage);

        worker.postMessage({ json });
    });
};
