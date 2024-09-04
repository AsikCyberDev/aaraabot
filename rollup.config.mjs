// rollup.config.js
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/ChatBot.js',
    output: [
        {
            file: 'dist/chatbot.js',
            format: 'es', // ES module format
        },
        {
            file: 'dist/chatbot.cjs.js',
            format: 'cjs', // CommonJS format for Node.js environments
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env'],
        }),
    ],
    external: ['lit'], // Externalize Lit to be provided by the consumer environment
};
