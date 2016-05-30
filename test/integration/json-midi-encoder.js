import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { encodeJSON } from '../../src/module';

describe('json-midi-encoder', function () {

    describe('encodeJSON()', function () {

        leche.withData({ // eslint-disable-line no-undef
            'because': [ 'because.mid', 'because.json' ],
            'scale': [ 'scale.mid', 'scale.json' ],
            'SubTractor 1': [ 'SubTractor 1.mid.txt', 'SubTractor 1.json' ],
            'SubTractor 2': [ 'SubTractor 2.mid', 'SubTractor 2.json' ]
        }, function (midiFilename, jsonFilename) {

            it('should encode the json object', function (done) {
                loadFixtureAsArrayBuffer(midiFilename, function (err, arrayBuffer) {
                    expect(err).to.be.null;

                    loadFixtureAsJson(jsonFilename, function (err, json) {
                        expect(err).to.be.null;

                        encodeJSON(json)
                            .then(function (midiFile) {
                                expect(new Uint8Array(midiFile)).to.deep.equal(new Uint8Array(arrayBuffer));

                                done();
                            })
                            .catch(done);
                    });
                });
            });

            it('should refuse to encode a none json object', function (done) {
                loadFixtureAsArrayBuffer(midiFilename, function (err, arrayBuffer) {
                    expect(err).to.be.null;

                    encodeJSON(arrayBuffer)
                        .catch(function (err) {
                            expect(err.message).to.equal('The given JSON object seems to be invalid.');

                            done();
                        });
                });
            });

        });

    });

});
