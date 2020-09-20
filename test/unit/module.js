import * as jsonMidiEncoder from '../../src/module';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {
    describe('encode()', () => {
        leche.withData(
            [
                ['98137'],
                ['A_F_NO7_01'],
                ['MIDIOkFormat1-lyrics'],
                ['MIDIOkFormat2'],
                ['SubTractor 1'],
                ['SubTractor 2'],
                ['TheEntertainer'],
                ['because'],
                ['californication'],
                ['minute_waltz'],
                ['rachmaninov3'],
                ['scale'],
                ['test'],
                ['test8bars']
            ],
            (filename) => {
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
        );
    });
});
