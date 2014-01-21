module.exports = function(grunt) {
	grunt.initConfig({

		// define source files and their destinations
		concat : {
			css : {
				src : ['style/*'],
				dest : 'min/combined.css'
			}
		},
		cssmin : {
			css : {
				src : 'min/combined.css',
				dest : 'min/slider.min.css'
			}
		},
		uglify : {
			options: {
				mangle: false
			},
			js : {
				files : {
					'min/slider.min.js' : ['script/slider.js'],
					'min/leapcontroller.min.js' : ['script/leapcontroller.js']
				}
			}
		},
		jshint : {
			// define the files to lint
			files : ['gruntfile.js', 'script/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options : {
				// more options here if you want to override JSHint defaults
				globals : {
					jQuery : false,
					console : true,
					module : true
				}
			}
		},
		watch : {
			js : {
				files : 'script/*.js',
				tasks : ['uglify']
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['concat:css', 'cssmin:css', 'uglify:js', 'jshint']);

};
