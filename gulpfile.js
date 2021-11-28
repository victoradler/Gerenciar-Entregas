const uglify = require('gulp-uglify')
var concat = require('gulp-concat');

var sass = require('gulp-sass')(require('sass'));
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

const { src, dest, watch } = require("gulp");

function js(){
     return src(['js/*.js'])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest('.'))
}

function css() {
    return src('./scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('.'))
};
  
exports.js = js;
exports.css = css; 
exports.default = function() {
    watch('js/*.js', js);
    watch('scss/*.scss', css);
};