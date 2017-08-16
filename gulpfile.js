"use strict";
const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');

const tsProject = ts.createProject('tsconfig.json', {
  declaration: false
});

gulp.task('phantom-copy', function () {
  gulp.src('src/server/phantom/exec.js')
    .pipe(gulp.dest('server_build/server/phantom'));
});

gulp.task('typescript', function () {
  let tsResult = gulp.src('src/**/*.ts').pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('build')),
    tsResult.js.pipe(gulp.dest('build'))
  ]);
});

// gulp.task('watch', ['typescript', 'phantom-copy'], function () {
gulp.task('watch', ['phantom-copy'], function () {
  // gulp.watch('src/**/*.ts', ['typescript']);
  gulp.watch('src/server/phantom/exec.js', ['phantom-copy']);
});