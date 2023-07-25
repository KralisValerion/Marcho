const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const { notify } = require('browser-sync');
const browsersync = require('browser-sync').create();
const del = require('del')

function styles() {
    return src("app/scss/style.scss")
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true,
        }))
        .pipe(dest("app/css"))
        .pipe(browsersync.stream())

};

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
        'app/js/main.js'
    ])
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(dest("app/js"))
        .pipe(browsersync.stream())
}

function browsersyncs() {
    browsersync.init({
        server: {
            baseDir: "app/"
        },
        notify: false,
    })
}

function imageminification() {
    return src("app/img/**/*.*")
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest("dist/img"))
}
function watcher() {
    watch(['app/scss/**/*.scss'], styles);
    watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts)
    watch("app/**/*.html").on("change", browsersync.reload)
}

function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersyncs = browsersyncs;
exports.imagemin = imageminification;

exports.watcher = watcher;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, imagemin, build);
exports.default = parallel(styles, scripts, browsersyncs, watcher); 