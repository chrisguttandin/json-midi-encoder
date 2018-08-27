import { IMidiFile, load } from 'json-midi-encoder-broker';
import { worker } from './worker/worker';

const blob: Blob = new Blob([ worker ], { type: 'application/javascript; charset=utf-8' });

const url: string = URL.createObjectURL(blob);

const jsonMidiEncoder = load(url);

// @todo Out of some reason the encode() function has to be typed again.
export const encode: (midiFile: IMidiFile) => Promise<ArrayBuffer> = jsonMidiEncoder.encode;

URL.revokeObjectURL(url);
