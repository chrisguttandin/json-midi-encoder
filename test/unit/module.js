import * as jsonMidiEncoder from '../../src/module';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

describe('module', () => {
    describe('encode()', () => {
        for (const filename of filenames) {
            describe('with a json object', () => {
                let arrayBuffer;
                let json;

                beforeEach(async function () {
                    this.timeout(20000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                    json = await loadFixtureAsJson(`${filename}.json`);
                });

                it('should encode the json object', async function () {
                    this.timeout(20000);

                    const midiFile = await jsonMidiEncoder.encode(json);

                    expect(new Uint8Array(midiFile)).to.deep.equal(new Uint8Array(arrayBuffer));
                });
            });

            describe('with a binary file', () => {
                let arrayBuffer;

                beforeEach(async function () {
                    this.timeout(20000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                });

                it('should refuse to encode the file', function (done) {
                    jsonMidiEncoder.encode(arrayBuffer).catch((err) => {
                        expect(err.message).to.equal('The given JSON object seems to be invalid.');

                        done();
                    });
                });
            });
        }
    });
});
