module.exports = {
    devtool: false,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',  // Injects styles into DOM
                    'css-loader',    // Resolves `@import` and `url()`
                    'postcss-loader' // Processes PostCSS (including Tailwind)
                ],
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/, // Exclude CSS modules
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.module\.css$/, // CSS Modules
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};