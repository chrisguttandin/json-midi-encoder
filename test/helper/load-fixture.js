function base64ToArrayBuffer(encodedData) {
    var decodedData,
        uint8Array;

    decodedData = atob(encodedData.replace(/\s/g, '')); // eslint-disable-line no-undef
    uint8Array = new Uint8Array(decodedData.length);

    Array.prototype.forEach.call(uint8Array, function (value, index) {
        uint8Array[index] = decodedData.charCodeAt(index);
    });

    return uint8Array.buffer;
}

export const loadFixtureAsArrayBuffer = (fixture, callback) => {
    var request = new XMLHttpRequest(); // eslint-disable-line no-undef

    request.onerror = function () {
        callback('request-failed');
    };
    request.onload = function (event) {
        if (fixture.slice(-4) === '.txt') {
            callback(null, base64ToArrayBuffer(event.target.response));
        } else {
            callback(null, event.target.response);
        }
    };
    request.open('GET', 'base/test/fixtures/' + fixture);

    if (fixture.slice(-4) !== '.txt') {
        request.responseType = 'arraybuffer';
    }

    request.send();
};

export const loadFixtureAsJson = (fixture, callback) => {
    var request = new XMLHttpRequest(); // eslint-disable-line no-undef

    request.onerror = function () {
        callback('request-failed');
    };
    request.onload = function (event) {
        try {
            callback(null, JSON.parse(event.target.response));
        } catch (err) {
            callback('request-failed');
        }
    };
    request.open('GET', 'base/test/fixtures/' + fixture);
    request.send();
};
