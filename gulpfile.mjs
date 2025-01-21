import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import obfuscate from 'gulp-obfuscate';
import imagemin, { mozjpeg, optipng, svgo } from 'gulp-imagemin';

// Configure o gulp-sass para usar o compilador sass
const sassCompiler = gulpSass(sass);

function compilaSass() {
    return gulp.src('./source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sassCompiler({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/css'));
}

function comprimejavascript() {
    return gulp.src('./source/scripts/*.js')
        .pipe(uglify())
        .pipe(obfuscate())
        .pipe(gulp.dest('./dist/scripts'));
}

function compressImages() {
    return gulp.src('./source/images/*')
        .pipe(imagemin([
            mozjpeg({ quality: 75, progressive: true }),
            optipng({ optimizationLevel: 5 }),
            svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/images'));
}

function watchFiles() {
    gulp.watch('./source/styles/**/*.scss', compilaSass);
    gulp.watch('./source/scripts/*.js', comprimejavascript);
    gulp.watch('./source/images/*', compressImages);
}

export default gulp.series(
    gulp.parallel(compilaSass, comprimejavascript, compressImages),
    watchFiles
);
