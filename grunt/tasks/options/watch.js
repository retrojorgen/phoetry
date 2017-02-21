module.exports = {
  options: {
    livereload: true,
  },
  scripts: {
    files: ['source/scripts/js/**/*.js'],
    tasks: ['clean:js', 'copy:js'],
    options: {
      spawn: false,
    }
  },
  html: {
    files: ['source/scripts/views/**/*.html'],
    tasks: ['clean:html', 'copy:html'],
    options: {
      spawn: false
    }
  },
  stylus: {
    files: ['source/stylus/**/*.styl'],
    tasks: ['clean:css', 'stylus:dev'],
    options: {
      spawn: false
    }
  }
}