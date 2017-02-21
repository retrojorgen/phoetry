module.exports = function(grunt) {
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('build', ['clean', 'copy', 'stylus']);
};