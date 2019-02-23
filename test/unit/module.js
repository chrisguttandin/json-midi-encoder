import * as jsonMidiEncoder from '../../src/module';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    describe('encode()', () => {

        leche.withData([
            [ 'A_F_NO7_01' ],
            [ 'because' ],
            [ 'MIDIOkFormat1-lyrics' ],
            [ 'MIDIOkFormat2' ],
            [ 'minute_waltz' ],
            [ 'rachmaninov3' ],
            [ 'scale' ],
            [ 'SubTractor 1' ],
            [ 'SubTractor 2' ],
            [ 'test8bars' ]
        ], (filename) => {

            it('should encode the json object', function (done) {
                this.timeout(4000);

                loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    loadFixtureAsJson(filename + '.json', (rr, json) => {
                        expect(rr).to.be.null;

                        jsonMidiEncoder
                            .encode(json)
                            .then((midiFile) => {
                                expect(new Uint8Array(midiFile)).to.deep.equal(new Uint8Array(arrayBuffer));

                                done();
                            });
                    });
                });
            });

            it('should refuse to encode a none json object', function (done) {
                this.timeout(4000);

                loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    jsonMidiEncoder
                        .encode(arrayBuffer)
                        .catch((err2) => {
                            expect(err2.message).to.equal('The given JSON object seems to be invalid.');

                            done();
                        });
                });
            });

        });

    });

});
