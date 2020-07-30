const { src, dest, watch, parallel, series } = require('gulp');
const browser = require('browser-sync').create();
const sass = require('gulp-sass');
const del = require('del');
const path = {
  html: {
    start: './src/html/**/*.html',
    end: 'dist'
  },
  scss: {
    start: './src/assets/scss/**/*.scss',
    end: 'dist/assets/css'
  },
  js: {
    start: './src/assets/js/**/*.js',
    end: 'dist/assets/js'
  },
  img: {
    start: './src/assets/img/**/*.{svg,png,jpg,jpeg}',
    end: 'dist/assets/img'
  },
  base: 'dist'
};

function server(cb) {
  browser.init({
    server: {
      baseDir: path.base
    }
  });

  cb();
}

function reload(cb) {
  browser.reload();
  cb();
}

function html(cb) {
  return src(path.html.start).pipe(dest(path.html.end));
  cb();
}
function js(cb) {
  return src(path.js.start).pipe(dest(path.js.end));
  cb();
}

function scss(cb) {
  return src(path.scss.start)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(path.scss.end));
  cb();
}
function images(cb) {
  return src(path.img.start).pipe(dest(path.img.end));
  cb();
}

function watcher(cb) {
  watch(path.html.start, series(html, reload));
  watch(path.js.start, series(js, reload));
  watch(path.img.start, series(images, reload));
  watch(path.scss.start, series(scss, reload));
  cb();
}

function clean(cb) {
  del(path.base);
  cb();
}

exports.default = series(
  clean,
  parallel(images, html, js, scss),
  parallel(server, watcher)
);
