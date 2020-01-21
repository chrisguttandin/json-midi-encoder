module.exports = (grunt) => {
    const continuous = (grunt.option('continuous') === true);
    const fix = (grunt.option('fix') === true);

    return {
        'build-es2018': {
            cmd: 'tsc -p src/tsconfig.json'
        },
        'build-es5': {
            cmd: 'rollup -c config/rollup/bundle.js'
        },
        'lint-config': {
            cmd: `eslint --config config/eslint/config.json ${ (fix) ? '--fix ' : '' }--report-unused-disable-directives *.js config/**/*.js`
        },
        'lint-src': {
            cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
        },
        'lint-test': {
            cmd: `eslint --config config/eslint/test.json ${ (fix) ? '--fix ' : '' }--report-unused-disable-directives test/**/*.js`
        },
        'test-unit': {
            cmd: `karma start config/karma/config-unit.js ${ continuous ? '--concurrency Infinity' : '--single-run' }`
        }
    };
};
