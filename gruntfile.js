'use strict';


module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    require('load-grunt-config')(grunt);


    grunt.registerTask('build', [
        'clean:dist',
        'ts',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
