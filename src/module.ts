import { load } from 'json-midi-encoder-broker';
import { worker } from './worker/worker';

const blob: Blob = new Blob([ worker ], { type: 'application/javascript; charset=utf-8' });

const url: string = URL.createObjectURL(blob);

const jsonMidiEncoder = load(url);

export const encode = jsonMidiEncoder.encode;

URL.revokeObjectURL(url);
