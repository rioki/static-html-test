var path        = require('path');
var fs          = require('fs');
var gulp        = require('gulp');
var marked      = require('gulp-marked');
var rename      = require('gulp-rename');
var clean       = require('gulp-clean');
var mustache    = require('mustache');
var through     = require('through2');

function template(templateFile) {
    var tpl = fs.readFileSync(path.join(__dirname, templateFile), 'utf8');
    
    return through.obj(function (file, enc, cb) {
        var data = {
            content: file.contents.toString()
        };
        file.contents = new Buffer(mustache.render(tpl, data), 'utf8');
        this.push(file);
        cb();
    });
}

gulp.task('assets', function () {
    return gulp.src('assets/**/*')
        .pipe(gulp.dest('build/'));
});

gulp.task('pages', function () {
    return gulp.src('pages/*.md')
        .pipe(marked())
        .pipe(template('templates/page.html'))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['assets', 'pages']);

gulp.task('clean', function() {
    return gulp.src('build', {read: false})
        .pipe(clean());
});