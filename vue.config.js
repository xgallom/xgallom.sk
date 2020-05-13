module.exports = {
    pages: {
        index: {
            entry: 'src/index/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'XOS - xgallom.sk',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
        blog: {
            entry: 'src/blog/main.js',
            template: 'public/index.html',
            filename: 'blog.html',
            title: 'Blog - xgallom.sk',
            chunks: ['chunk-vendors', 'chunk-common', 'blog'],
        },
    },
};
