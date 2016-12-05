import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    dest: 'build/es5/script.js',
    entry: 'build/es2015/module.js',
    format: 'umd',
    moduleName: 'jsonMidiEncoder',
    plugins: [
        babel({
            presets: [
                [
                    'es2015',
                    {
                        modules: false
                    }
                ]
            ]
        }),
        nodeResolve({
            jsnext: true
        })
    ]
};
