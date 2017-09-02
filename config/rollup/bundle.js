import babel from 'rollup-plugin-babel';

export default {
    input: 'build/es2015/module.js',
    output: {
        file: 'build/es5/bundle.js',
        format: 'umd',
        name: 'jsonMidiEncoder'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            plugins: [
                'external-helpers',
                [
                    'transform-runtime', {
                        polyfill: false
                    }
                ]
            ],
            presets: [
                [
                    'es2015',
                    {
                        modules: false
                    }
                ]
            ],
            runtimeHelpers: true
        })
    ]
};
