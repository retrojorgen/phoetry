module.exports = {
  js: {
    expand: true,
    cwd: 'source/scripts/js/',
    src: '**/*.js',
    dest: 'assets/scripts/js/',
  },
  html: {
  	expand: true,
    cwd: 'source/scripts/views/',
    src: '**/*.html',
    dest: 'assets/scripts/views/',
  }
}