var syntax = 'sass', // Syntax: sass or scss;
    gulpversion = '4'; // Gulp version: 3 or 4

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    rsync = require('gulp-rsync'),
    webpack = require('webpack'),
    sourcemaps = require('gulp-sourcemaps'),
    webpackStream = require('webpack-stream');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        open: false,
        online: false, // Work Offline Without Internet Connection
        tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
});

gulp.task('styles', function () {
    return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
        .pipe(rename({ basename: "landing-new", extname: ".css" }))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/dest/css'))
        .pipe(browserSync.stream())
});

// gulp.task('scripts', function () {
//     return gulp.src([
//         // 'app/libs/jquery/dist/jquery.min.js',
//         // 'app/libs/jquery.inputmask.js',
//         // 'app/js/common.js', // Always at the end
//     ])
//         .pipe(concat('libs.js'))
//         // .pipe(uglify()) // Mifify js (opt.)
//         .pipe(gulp.dest('app/dest/js'))
//         .pipe(browserSync.reload({ stream: true }))
// });

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts-webpack', function () {
    return gulp.src('app/js/*.js')
        .pipe(webpackStream({
            output: {
                filename: 'landing-new.js',
            },
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest('app/dest/js/'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/dest/js/'));
});
gulp.task('rsync', function () {
    return gulp.src('app/**')
        .pipe(rsync({
            root: 'app/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            // include: ['*.htaccess'], // Includes files to deploy
            exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }))
});

if (gulpversion == 3) {
    gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function () {
        gulp.watch('app/' + syntax + '/**/*.' + syntax + '', ['styles']);
        // gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
        gulp.watch('app/*.html', ['code'])
    });
    gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
    gulp.task('watch', function () {
        gulp.watch('app/' + syntax + '/**/*.' + syntax + '', gulp.parallel('styles'));
        // gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
        gulp.watch('app/*.html', gulp.parallel('code'));
        gulp.watch('app/js/*.js', gulp.parallel('scripts-webpack'));
    });
    gulp.task('default', gulp.parallel('styles', 'scripts-webpack','browser-sync', 'watch'));
}
