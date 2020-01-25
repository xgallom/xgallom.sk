module.exports = {
    pages: {
        index: {
            entry: 'src/index/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
    },
};
