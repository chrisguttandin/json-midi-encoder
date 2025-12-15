import { beforeEach, describe, expect, it } from 'vitest';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { encode } from '../../src/module';
import { filenames } from '../helper/filenames';

describe('module', () => {
    describe('encode()', () => {
        for (const filename of filenames) {
            describe('with a json object', () => {
                let arrayBuffer;
                let json;

                beforeEach(async () => {
                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                    json = await loadFixtureAsJson(`${filename}.json`);
                });

                it('should encode the json object', async () => {
                    const midiFile = await encode(json);

                    expect(new Uint8Array(midiFile)).to.deep.equal(new Uint8Array(arrayBuffer));
                });
            });

            describe('with a binary file', () => {
                let arrayBuffer;

                beforeEach(async () => {
                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                });

                it('should refuse to encode the file', () => {
                    const { promise, resolve } = Promise.withResolvers();

                    encode(arrayBuffer).catch((err) => {
                        expect(err.message).to.equal('The given JSON object seems to be invalid.');

                        resolve();
                    });

                    return promise;
                });
            });
        }
    });
});
