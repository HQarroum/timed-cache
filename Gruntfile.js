module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Timing the build tasks.
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            dist: 'dist/*'
        },
        jshint: {
            dist: {
                src: ['*.js']
            },
            test: {
                src: ['tests/*.js']
            }
        },
        uglify: {
            dist: {
                src: 'cache.js',
                dest: 'dist/cache.min.js'
            }
        },
        mochaTest: {
            test: {
                src: ['tests/**/*.js'],
                options: {
                    timeout: 3000
                }
            }
        }
    });

    // Registering the tasks.
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'test']);
};
