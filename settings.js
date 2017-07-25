module.exports = {
    entry: ['./src/js/app.js', './src/sass/app.scss'],
    browsers: ['last 2 versions', 'ie >= 9'],
    port: 7000,
    proxy: "http://domain.local",
    https: false,
    host: '192.168.0.45'
}
