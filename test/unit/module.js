import * as jsonMidiEncoder from '../../src/module';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    describe('encode()', () => {

        leche.withData([
            [ '98137' ],
            [ 'A_F_NO7_01' ],
            [ 'MIDIOkFormat1-lyrics' ],
            [ 'MIDIOkFormat2' ],
            [ 'SubTractor 1' ],
            [ 'SubTractor 2' ],
            [ 'TheEntertainer' ],
            [ 'because' ],
            [ 'minute_waltz' ],
            [ 'rachmaninov3' ],
            [ 'scale' ],
            [ 'test' ],
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
                        .catch((err_) => {
                            expect(err_.message).to.equal('The given JSON object seems to be invalid.');

                            done();
                        });
                });
            });

        });

    });

});
