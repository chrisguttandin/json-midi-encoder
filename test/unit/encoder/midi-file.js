import * as midiFileEncoder from '../../../src/encoder/midi-file';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../../helper/load-fixture';

describe('midiFileEncoder', function () {

    describe('encodeJSON()', function () {

        leche.withData({
            'because': [ 'because.mid', 'because.json' ],
            'scale': [ 'scale.mid', 'scale.json' ],
            'SubTractor 1': [ 'SubTractor 1.mid.txt', 'SubTractor 1.json' ],
            'SubTractor 2': [ 'SubTractor 2.mid', 'SubTractor 2.json' ]
        }, function (midiFilename, jsonFilename) {

            it('should encode the json object', function (done) {
                this.timeout(3000);

                loadFixtureAsArrayBuffer(midiFilename, function (err, arrayBuffer) {
                    expect(err).to.be.null;

                    loadFixtureAsJson(jsonFilename, function (err, json) {
                        expect(err).to.be.null;

                        expect(new Uint8Array(midiFileEncoder.encodeJSON(json))).to.deep.equal(new Uint8Array(arrayBuffer));

                        done();
                    });
                });
            });

            it('should refuse to encode a none json object', function (done) {
                loadFixtureAsArrayBuffer(midiFilename, function (err, arrayBuffer) {
                    expect(err).to.be.null;

                    expect(function () {
                        midiFileEncoder.encodeJSON(arrayBuffer);
                    }).to.throw(Error, 'The given JSON object seems to be invalid.');

                    done();
                });
            });

        });

    });

});
