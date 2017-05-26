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
	jasmine: {
	    dist: {
		options: {
		    specs: ['tests/cache-spec.js'],
		    template: require('grunt-template-jasmine-requirejs'),
		    templateOptions: {
			requireConfig: {
			    buildPath: '../'
			}
		    },
		    junit: {
			path: 'reports/junit/jasmine'
		    }
		}
	    }
	}
    });

    // Registering the tasks.
    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'test']);
};
