module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    watch: {
      tasks: 'default'
    }
  });

  // Default task.
  grunt.registerTask('default', 'test');

};