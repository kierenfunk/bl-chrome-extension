const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "src");

module.exports = {
    mode: 'production',
    entry: {
      popup: path.join(srcDir, "views/popup.tsx"),
      sidebar: path.join(srcDir, "views/sidebar.tsx"),
      contentScript: path.join(srcDir, 'contentScript.js'),
      crmContentScript: path.join(srcDir, 'crmContentScript.ts'),
      inject: path.join(srcDir, 'inject.ts'),
      options: path.join(srcDir, 'options.js'),
    },
    output: {
        path: path.join(__dirname, "/dist/js"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};