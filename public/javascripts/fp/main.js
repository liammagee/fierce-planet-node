
//$LAB.script('http://maps.googleapis.com/maps/api/js?sensor=true').wait()

var fpSrc = [ 'fp/fp.min.js' ];
if (node_env == 'development') {
    fpSrc = [
         'fp/core/universe.js'
         , 'fp/core/catastrophe.js'
         , 'fp/core/agent/agent.js' , 'fp/core/agent/culture.js' , 'fp/core/agent/beliefs.js' , 'fp/core/agent/desires.js' , 'fp/core/agent/capabilities.js' , 'fp/core/agent/characteristics.js' , 'fp/core/agent/plans.js'
         , 'fp/core/campaign.js', 'fp/core/cell.js', 'fp/core/world.js', 'fp/core/wave.js', 'fp/core/resource.js', 'fp/core/species.js', 'fp/core/terrain.js', 'fp/core/tile.js'
         , 'fp/core/module-manager.js' , 'fp/core/module.js', 'fp/core/lifecycle.js', 'fp/core/statistics.js'

        , 'fp/core/agent/defaults/default_cultures.js'

        , 'fp/profile/profile.js', 'fp/profile/profile_class.js', 'fp/event/event.js'
         , 'fp/graphics/drawing.js', 'fp/graphics/orientation.js', 'fp/graphics/isometric.js', 'fp/graphics/fullscreen.js'
        , 'fp/graphics/stick-figure.js'

         , 'fp/ui/dialogs/dialogs.js'
         , 'fp/ui/controls.js'
         , 'fp/ui/keyboard.js'
         , 'fp/ui/mouse.js'
         , 'fp/ui/editor.js'
         , 'fp/ui/general-ui.js'
         , 'fp/ui/world-gallery.js'
         , 'fp/ui/world-ui.js'
         , 'fp/ui/notice.js'
         , 'fp/ui/profile-ui.js'
         , 'fp/ui/resource-ui.js'
         , 'fp/ui/graph.js'
         , 'fp/ui/slider.js'
         , 'fp/ui/module-editor.js'
         , 'fp/ui/parameters.js'
         , 'fp/ui/console.js'
         , 'fp/ui/storyboard.js'
         , 'fp/ui/google-map.js'

         , 'fp/utils/fp-utils.js', 'fp/utils/log.js', 'fp/utils/recording.js', 'fp/utils/url-params.js'
        , 'fp/utils/comms.js'
        , 'fp/game.js'
    ];

}

$LAB
    .setOptions({BasePath:'/javascripts/'})


    // Load JQuery
   .script('jquery/jquery-1.7.1.min.js')

    // Load JQuery UI & Plug-ins
    .script([
    /*
        'jquery-ui-1.9.0-beta.1/ui/minified/jquery-ui.min.js'
        , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.accordion.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.autocomplete.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.button.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.core.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.datepicker.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.dialog.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.draggable.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-blind.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-bounce.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-clip.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-drop.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-explode.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-fade.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-fold.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-highlight.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-pulsate.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-scale.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-shake.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-slide.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect-transfer.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.effect.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.menu.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.mouse.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.position.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.progressbar.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.resizable.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.selectable.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.slider.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.sortable.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.spinner.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.tabs.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.tooltip.min.js'
    , 'jquery-ui-1.9.0-beta.1/ui/minified/jquery.ui.widget.min.js'
    */
        'jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min.js'
        , 'jquery.balloon/jquery.balloon.js'
        , 'jquery.mousewheel.3.0.2/jquery.mousewheel.js'
        , 'jquery/jquery-animate-css-rotate-scale.js'
        , 'jquery/jquery.zoom.js'
    ])

    // Load other libraries
    .script([
      'CodeMirror-2.2/lib/codemirror.js'
    , 'CodeMirror-2.2/mode/javascript/javascript.js'
    , 'flot-0.7/flot/jquery.flot.min.js'
    , 'jpicker-1.1.6/jpicker-1.1.6.js'
    , 'jq-console/jqconsole-2.7.min.js'
    , 'jstat-2.0/jstat.js'
    , 'one-color/one-color-all.js'
    , 'socket.io/socket.io.js'
    , 'spin.js/spin.min.js'
    , 'sylvester/sylvester.js'
    , 'underscore/underscore-min.js'
    ])

    // Load FiercePlanet specific submodules
   .script(
        'gofigure/test/go-figure.js'
    )

        // Load FiercePlanet other plugins
   .script(
        fpSrc
    )

    .script([
     , 'fp/default-module/default-module.js'
     , 'fp/default-module/resources/tbl.js'
     , 'fp/default-module/resources/cos.js'
     , 'fp/default-module/resources/resource_types.js'
     , 'fp/default-module/worlds/basic.js'
     , 'fp/default-module/worlds/additional.js'
    ])
    .wait(function() {
        FiercePlanet.GoogleMapUtils.initMaps();
        var m = urlParams.module;
        if (!_.isUndefined(m)) {
            if (m == 'pp') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    'fp-modules/tests/pp/predator-prey-module.js' , 'fp-modules/tests/pp/worlds/pp-worlds.js' , 'fp-modules/tests/pp/agents/pp-agent-types.js'
                ]).wait(function() {
                    PredatorPreyModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'gol') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    'fp-modules/tests/gol/game-of-life-module.js'
                ]).wait(function() {
                    GameOfLifeModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'ca') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    'fp-modules/tests/ca/ca-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        CellularAutomataModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'cities') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/tests/cities/cities-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                    CitiesModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'nl' || m == 'netlogo') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/tests/netlogo/netlogo-module.js'
                ]).wait(function() {
                        $('#moduleEditor').show();
                        NetLogoModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'rpg') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/sandbox/rpg/rpg-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        GameOfLifeModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'mpm') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/trials/mpm/mpm-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        MPMModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'rmit') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/trials/rmit/rmit-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        RMITModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'techo') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/trials/techo/techo-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        TechoModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'whittlesea' || m == 'ws') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/trials/whittlesea/ws-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        WhittleseaModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'uofi') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    'fp-modules/trials/uofi/uofi-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        UofIModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'wv') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/trials/wv/wv-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        WorldVisionModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'game2') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/game2/game2-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        Game2Module.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'td') {
                $LAB.setOptions({BasePath:'/javascripts/'}).script([
                    , 'fp-modules/td/td-module.js'
                ]).wait(function() {
//                $('#moduleEditor').show();
                        TowerDefenceModule.init();
                        $('#content-pane').show();
                        FiercePlanet.Game.loadGame();
                    })
            }
            else if (m == 'default' || m == 'fp') {
                DefaultModule.init();
                $('#content-pane').show();
                FiercePlanet.Game.loadGame();
            }
        }
        else {
            DefaultModule.init();
            $('#content-pane').show();
            if (window.location.pathname === '/mobile') {
                Universe.settings.mobile = true;
                Universe.settings.useInlineResourceSwatch = true;
                FiercePlanet.Orientation.worldWidth = $(window).width();
                FiercePlanet.Orientation.worldHeight = $(window).height() - 160;
            }
            FiercePlanet.Game.loadGame();
        }
        var world = urlParams.world;
        if (!_.isUndefined(world)) {
            Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = world;
        }
    })

