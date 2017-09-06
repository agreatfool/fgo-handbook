"use strict";
const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');

const rnSource = ['src/**/*.ts', 'src/**/*.tsx', '!src/{server,server/**}'];
const rnResource = ['src/resource/**/*', '!src/resource/ImagePool.ts'];
const serverSource = ['src/**/*.ts', '!src/{mobile,mobile/**}'];
const serverTemplateSource = 'src/server/template/**/*.hbs';

const tsRnProject = ts.createProject('tsconfig.json', {
  declaration: false
});
const tsServerProject = ts.createProject('server-tsconfig.json', {
  declaration: false
});

gulp.task('tsRn', function () {
  let tsResult = gulp.src(rnSource).pipe(tsRnProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('build')),
    tsResult.js.pipe(gulp.dest('build'))
  ]);
});

gulp.task('tsServer', function () {
  let tsResult = gulp.src(serverSource).pipe(tsServerProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('server_build')),
    tsResult.js.pipe(gulp.dest('server_build'))
  ]);
});

gulp.task('rn-copy', function () {
  gulp.src(rnResource)
    .pipe(gulp.dest('build/resource'));
});

gulp.task('server-copy', function () {
  gulp.src(serverTemplateSource)
    .pipe(gulp.dest('server_build/server/template'));
});

gulp.task('watch', ['tsRn', 'tsServer', 'rn-copy', 'server-copy'], function () {
  gulp.watch(rnSource, ['tsRn']);
  gulp.watch(rnResource, ['rn-copy']);
  gulp.watch(serverSource, ['tsServer']);
  gulp.watch(serverTemplateSource, ['server-copy']);
});