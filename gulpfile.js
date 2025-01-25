const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const obfuscate = require('gulp-obfuscate');
const imagemin = require('gulp-imagemin');

// Função para compilar o SASS
function compilaSass() {
    return gulp.src('./source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/css'));
}

// Função para comprimir JavaScript
function comprimejavascript() {
    return gulp.src('./source/scripts/*.js')
        .pipe(uglify())
        .pipe(obfuscate())
        .pipe(gulp.dest('./dist/scripts'));
}

// Função para otimizar imagens
function compressImages() {
    return gulp.src('./source/images/*.{jpg,jpeg,png,svg}')
        .pipe(imagemin([
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/images'));
}

// Função para observar mudanças nos arquivos
function watchFiles() {
    gulp.watch('./source/styles/**/*.scss', compilaSass);
    gulp.watch('./source/scripts/*.js', comprimejavascript);
    gulp.watch('./source/images/*.{jpg,jpeg,png,svg}', compressImages);
}

// Exportar as tarefas padrão do Gulp
exports.default = gulp.series(
    gulp.parallel(compilaSass, comprimejavascript, compressImages),
    watchFiles
);
