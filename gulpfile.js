'use strict';

var gulp = require('gulp'),
	del = require('del'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	flatten = require('gulp-flatten'),
	imagemin = require('gulp-imagemin'),
	runSequence = require('run-sequence'),
	minifyCSS = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	mainBowerFiles = require('main-bower-files'),
	browserSync = require('browser-sync').create(),
	gulpHandlebars = require('gulp-compile-handlebars');

// Bases
var bases = {
	app: 'app/',
	dist: 'dist/'
}

// Paths
var paths = {
	styles: [bases.app+'styles/*.scss'],
	scripts: [bases.app+'scripts/*.js', '!'+bases.app+'scripts/components/'],
	images: [bases.app+'images/**/*.{gif,jpg,png,jpeg}']
}

// Path Json
var dataObj = require('./'+bases.app+'data/data.json');

// JS Lint
gulp.task('lint', function() {
	return gulp.src(paths.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Clean Directories
gulp.task('clean', function() {
	return del(['dist']);
});

// Task Browser Sync
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
	})
});

// Handlebars
gulp.task('handlebars', function() {
	return gulp.src(bases.app+'*.html')
		.pipe(gulpHandlebars(dataObj))
		.pipe(gulp.dest(bases.dist))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Copy Fonts
gulp.task('copyAssets', function() {
	gulp.src(bases.app+'styles/imgs/**/*.{gif,jpg,png,jpeg}')
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest(bases.dist+'styles/imgs'))

	gulp.src(bases.app+'scripts/components/fullcalendar/dist/lang-all.js')
		.pipe(gulp.dest(bases.dist+'scripts'));

	return gulp.src(bases.app+'styles/fonts/**/*')
		.pipe(gulp.dest(bases.dist+'styles/fonts'));
});

gulp.task('components', function() {
	return gulp.src(mainBowerFiles(), {base: bases.app+'scripts/components'})
		.pipe(flatten({includeParents:[1,2]}))
		.pipe(gulp.dest(bases.dist+'scripts/components'));
});

// Task Styles
gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(sourcemaps.init())
	    .pipe(concat('main.min.css'))
	    .pipe(sass({style: 'expanded'}))
		.pipe(minifyCSS())
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest(bases.dist+'styles'))
	    .pipe(browserSync.reload({
			stream: true
		}));
});

// Task Scripts
gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(bases.dist+'scripts'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Task images
gulp.task('images', function() {
	return gulp.src(paths.images)
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest(bases.dist+'images'));
});
 
// Rerun the task when a file changes
gulp.task('watch', ['browserSync'], function() {
	gulp.watch(bases.app+'*.html', ['handlebars']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.scripts, ['scripts'], function(){
		gulp.run('lint', 'scripts');
	});
});

// Default Task
gulp.task('default', function(callback) {
	runSequence('clean',
	['watch', 'handlebars', 'copyAssets', 'components', 'styles', 'scripts', 'images'], callback)
});
