const babel = require('babel-core');

const babelRC = {
    presets: [require('babel-preset-react-native')],
    plugins: [
        [require('babel-plugin-rewrite-require'), {
            aliases: {
                fs: 'node-libs-browser/mock/empty',
                path: 'path-browserify',
                crypto: 'crypto-browserify',
                net: 'node-libs-browser/mock/net',
                http: 'stream-http',
                https: 'https-browserify',
                tls: 'node-libs-browser/mock/tls',
                zlib: 'browserify-zlib',
                vm: 'vm-browserify',
                stream: 'stream-browserify',
                _stream_duplex: 'readable-stream/duplex',
                _stream_passthrough: 'readable-stream/passthrough',
                _stream_readable: 'readable-stream/readable',
                _stream_transform: 'readable-stream/transform',
                _stream_writable: 'readable-stream/writable',
            },
            throwForNonStringLiteral: true,
        }],
    ],
};

function transform({ src, filename, options }) {
    const babelConfig = Object.assign({}, babelRC, {
        filename,
        sourceFileName: filename,
    });
    const result = babel.transform(src, babelConfig);
    return {
        ast: result.ast,
        code: result.code,
        map: result.map,
        filename,
    };
}

module.exports.transform = transform;
