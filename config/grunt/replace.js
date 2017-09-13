const readFileSync = require('fs').readFileSync;

module.exports = {
    worker: {
        files: {
            'src/worker/worker.ts': [
                'src/worker/worker.ts'
            ]
        },
        options: {
            patterns: [ {
                match: /export\sconst\sworker\s=\s`(.*)`;/g,
                replacement: () => {
                    const workerPath = require.resolve('json-midi-encoder-worker/build/es5/worker.min');
                    const workerString = readFileSync(workerPath, { encoding: 'utf8' }).replace(/\\/g, '\\\\');

                    return `export const worker = \`${ workerString }\`;`;
                }
            } ]
        }
    }
};
