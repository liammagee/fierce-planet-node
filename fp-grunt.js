module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        // Project metadata, used by some directives, helpers and tasks.
        meta: {},
        // Lists of files to be concatenated, used by the "concat" task.
        concat: {
            dist: {
//                'public/javascripts/fp/**/*.js'
                src: [
                    'public/javascripts/fp/core/universe.js'
                    , 'public/javascripts/fp/core/catastrophe.js'
                    , 'public/javascripts/fp/core/agent/agent.js' , 'public/javascripts/fp/core/agent/culture.js' , 'public/javascripts/fp/core/agent/beliefs.js' , 'public/javascripts/fp/core/agent/desires.js' , 'public/javascripts/fp/core/agent/capabilities.js' , 'public/javascripts/fp/core/agent/characteristics.js' , 'public/javascripts/fp/core/agent/plans.js'
                    , 'public/javascripts/fp/core/campaign.js', 'public/javascripts/fp/core/cell.js', 'public/javascripts/fp/core/world.js', 'public/javascripts/fp/core/wave.js', 'public/javascripts/fp/core/resource.js', 'public/javascripts/fp/core/species.js', 'public/javascripts/fp/core/terrain.js', 'public/javascripts/fp/core/tile.js'
                    , 'public/javascripts/fp/core/module-manager.js' , 'public/javascripts/fp/core/module.js', 'public/javascripts/fp/core/lifecycle.js', 'public/javascripts/fp/core/statistics.js'

                    , 'public/javascripts/fp/core/agent/defaults/default_cultures.js'

                    , 'public/javascripts/fp/profile/profile.js', 'public/javascripts/fp/profile/profile_class.js', 'public/javascripts/fp/event/event.js'
                    , 'public/javascripts/fp/graphics/drawing.js', 'public/javascripts/fp/graphics/orientation.js', 'public/javascripts/fp/graphics/isometric.js', 'public/javascripts/fp/graphics/fullscreen.js', 'public/javascripts/fp/graphics/stick-figure.js'

                    , 'public/javascripts/fp/ui/dialogs/dialogs.js'
                    , 'public/javascripts/fp/ui/controls.js'
                    , 'public/javascripts/fp/ui/keyboard.js'
                    , 'public/javascripts/fp/ui/mouse.js'
                    , 'public/javascripts/fp/ui/editor.js'
                    , 'public/javascripts/fp/ui/general-ui.js'
                    , 'public/javascripts/fp/ui/world-gallery.js'
                    , 'public/javascripts/fp/ui/world-ui.js'
                    , 'public/javascripts/fp/ui/notice.js'
                    , 'public/javascripts/fp/ui/profile-ui.js'
                    , 'public/javascripts/fp/ui/resource-ui.js'
                    , 'public/javascripts/fp/ui/graph.js'
                    , 'public/javascripts/fp/ui/slider.js'
                    , 'public/javascripts/fp/ui/module-editor.js'
                    , 'public/javascripts/fp/ui/parameters.js'
                    , 'public/javascripts/fp/ui/console.js'
                    , 'public/javascripts/fp/ui/storyboard.js'
                    , 'public/javascripts/fp/ui/google-map.js'
                    , 'public/javascripts/fp/utils/fp-utils.js', 'public/javascripts/fp/utils/log.js', 'public/javascripts/fp/utils/recording.js', 'public/javascripts/fp/utils/url-params.js'
                    , 'public/javascripts/fp/game.js'
                    , 'public/javascripts/fp/utils/comms.js'
                ],
                dest: 'public/javascripts/fp/fp.concat.js'
            }
        },
        // Lists of files to be linted with JSHint, used by the "lint" task.
        lint: {
            files: ['grunt.js', 'public/javascripts/fp/**/*.js', 'test/**/*.js']
        },
        // Lists of files to be minified with UglifyJS, used by the "min" task.
        min: {
            dist: {
                src: [
                    'public/javascripts/fp/fp.concat.js'
                ],
                dest: 'public/javascripts/fp/fp.min.js'
            }
        },
        // Lists of files or URLs to be unit tested with QUnit, used by the "qunit" task.
        qunit: {},
        // Configuration options for the "server" task.
        server: {},
        // Lists of files to be unit tested with Nodeunit, used by the "test" task.
        test: {
            files: ['test/**/*.js']
        },
        // Configuration options for the "watch" task.
        watch: {},
        // Global configuration options for JSHint.
        jshint: {},
        // Global configuration options for UglifyJS.
        uglify: {
        },

        watch: {
            files: '<config:lint.files>',
            tasks: 'default'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true
            },
            globals: {
                exports: true
            }
        },

        less: {
            fp: {
                src: 'public/stylesheets/fp.less',
                dest: 'public/stylesheets/fp.css',
                options: {
                    compress: true
                }
            },
            fp_jquery_ui: {
                src: 'public/stylesheets/custom/fp-jquery-ui-1.8.14.less',
                dest: 'public/stylesheets/custom/fp-jquery-ui-1.8.14.css',
                options: {
                    compress: true
                }
            }
        },

        jasmine: {
            all: ['specs/specrunner.html']
        }
    });

    grunt.loadNpmTasks('grunt-less');
    grunt.loadNpmTasks('grunt-jasmine-task');

    // Default task.
//    grunt.registerTask('default', 'lint test config min');
    grunt.registerTask('default', 'concat less min');


    // TODO: add support for Jasmine-node
};