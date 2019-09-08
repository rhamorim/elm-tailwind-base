var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var purgecss = require('gulp-purgecss');
var tailwindcss = require('tailwindcss');
var elm = require('gulp-elm');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

function css_base() {
	var plugins = [
		tailwindcss('./tailwind.config.js'),
		autoprefixer()
	];
	return gulp.src('./css/*.css')
		.pipe(postcss(plugins))
		;
}

function css_prod(cb) {
	return css_base()
		.pipe(
			purgecss({
				content: [
					'./html/*.html'
				],
				defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
			})
		)
		.pipe(gulp.dest('./target/release/css'))
		;
	cb();
}

function css_dev(cb) {
	return css_base()
		.pipe(gulp.dest('./target/debug/css'))
		.pipe(browserSync.stream());
	cb();
}

function elm_base(path, flags) {
  	return gulp.src('./elm/Main.elm')
    	.pipe(elm(flags))
    	.pipe(rename({basename: "elm"}))
    	.pipe(gulp.dest(path))
}

function elm_prod(cb) {
	return elm_base(
		'./target/release/js',
		{ optimize: true }
		)
		.pipe(uglify({
			mangle: false,
			compress: {
				pure_funcs: ['F2','F3','F4','F5','F6','F7','F8','F9','A2','A3','A4','A5','A6','A7','A8','A9'],
				pure_getters: true,
				keep_fargs: false,
				unsafe_comps: true,
				unsafe: true
			}
		}))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./target/release/js'));

	cb();
}

function elm_dev(cb) {
	return elm_base(
		'./target/debug/js',
		{ debug: true }
		)
		.pipe(browserSync.stream());
	cb();
}

function html_base(path) {
	return gulp.src('./html/*.html')
		.pipe(gulp.dest(path));
}

function html_dev(cb) {
	return html_base('./target/debug')
		.pipe(browserSync.stream());
	cb();
}

function html_prod(cb) {
	return html_base('./target/release');
	cb();
}

function assets_prod(cb) {
	return gulp.src('./assets/**')
		.pipe(gulp.dest("./target/release/static/"));
	cb();
}

function serve(cb) {
	browserSync.init({
		server: {
			baseDir: "./target/debug/",
			routes: {
				"/static": "./assets"
			}
		}
	});

	gulp.watch(["./css/*.css", "tailwind.js"], css_dev);
	gulp.watch("./elm/**/*.elm", elm_dev);
	gulp.watch("./html/*.html", html_dev);
	cb();
}

exports.serve = gulp.series(
	gulp.parallel(html_dev, css_dev, elm_dev),
	serve
	);

exports.build = gulp.parallel(html_prod, css_prod, elm_prod, assets_prod);

exports.default = exports.serve
