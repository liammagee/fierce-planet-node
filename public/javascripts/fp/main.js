
$LAB
    .setOptions({BasePath:'/javascripts/'})


    // Load JQuery
   .script('jquery/jquery-1.7.1.min.js')
    .wait()

    // Load JQuery UI
    .script([
        'jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min.js'
        , 'jquery.mousewheel.3.0.2/jquery.mousewheel.js'
        , 'jquery/jquery-animate-css-rotate-scale.js'
        , 'jquery/jquery.zoom.js'
    ])

    // Load JQuery Plug-ins
//   .script("jquery.mousewheel.3.0.2/jquery.mousewheel.js")
//   .script("jquery-animate-css-rotate-scale.js")
//   .script("jquery/jquery.zoom.js")

   .script("underscore/underscore-min.js")

    // Load other plugins
   .script("spin.js/spin.min.js")
   .script("sylvester/sylvester.js")
   .script("flot-0.7/flot/jquery.flot.min.js")
   //.script("jstat-1.0.0/js/jstat-0.1.0.min.js")
   .script("jstat-1.0.0/js/jstat.js")
   .script("jpicker-1.1.6/jpicker-1.1.6.js")
   .script("jq-console/demo/jqconsole-min.js")
   // .script("/socket.io/socket.io.js")
   .script("CodeMirror-2.2/lib/codemirror.js")
   .script("CodeMirror-2.2/mode/javascript/javascript.js")
    .wait()

        // Load FiercePlanet other plugins
   .script([
        'fp/core/universe.js', 'fp/core/catastrophe.js'
       , 'fp/core/agent/agent.js' , 'fp/core/agent/culture.js' , 'fp/core/agent/beliefs.js' , 'fp/core/agent/desires.js' , 'fp/core/agent/capabilities.js' , 'fp/core/agent/characteristics.js' , 'fp/core/agent/plans.js'

    , 'fp/core/campaign.js', 'fp/core/cell.js', 'fp/core/world.js', 'fp/core/wave.js', 'fp/core/resource.js', 'fp/core/species.js', 'fp/core/terrain.js', 'fp/core/tile.js'
    , 'fp/core/module-manager.js' , 'fp/core/module.js', 'fp/core/lifecycle.js', 'fp/core/statistics.js'

    , 'fp/core/agent/defaults/default_cultures.js'

       , 'fp/profile/profile.js', 'fp/profile/profile_class.js', 'fp/event/event.js'

    , 'fp/graphics/drawing.js', 'fp/graphics/orientation.js', 'fp/graphics/isometric.js', 'fp/graphics/fullscreen.js', 'fp/graphics/stick-figure.js'

       , 'fp/ui/dialogs.js'
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
       , 'fp/ui/module-editor.js'
       , 'fp/ui/parameters.js'
       , 'fp/ui/console.js'
       , 'fp/ui/storyboard.js'
    , 'fp/ui/google-map.js'

       , 'fp/utils/fp-utils.js', 'fp/utils/log.js', 'fp/utils/recording.js', 'fp/utils/url-params.js'
       , 'fp/game.js'
   ])
    .wait()
    .script([
        'fp/modules/default/default-module.js'
        , 'fp/modules/default/worlds/basic.js'
        , 'fp/modules/default/worlds/additional.js'
        , 'fp/modules/default/resources/tbl.js'
        , 'fp/modules/default/resources/cos.js'
       , 'fp/modules/default/resources/resource_types.js'
//       , 'fp/modules/default/agents/default_cultures.js'
    , 'fp/modules/pp/predator-prey-module.js' , 'fp/modules/pp/worlds/pp-worlds.js' , 'fp/modules/pp/agents/pp-agent-types.js'
    , 'fp/modules/gol/game-of-life-module.js', 'fp/modules/ca/ca-module.js'
    , 'fp/modules/cities/cities-module.js'
    , 'fp/modules/netlogo/netlogo-module.js'
    ])
    .wait(function() {
        var m = urlParams.module;
        if (!_.isUndefined(m)) {
            if (m == 'pp') {
                PredatorPreyModule.init();
            }
            else if (m == 'gol') {
//                $('#moduleEditor').show();
                GameOfLifeModule.init();
            }
            else if (m == 'ca') {
//                $('#moduleEditor').show();
                CellularAutomataModule.init();
            }
            else if (m == 'cities') {
//                $('#moduleEditor').show();
                CitiesModule.init();
            }
            else if (m == 'nl' || m == 'netlogo') {
//                $('#moduleEditor').show();
                NetLogoModule.init();
            }
            else if (m == 'rpg') {
//                $('#moduleEditor').show();
                GameOfLifeModule.init();
            }
            else if (m == 'default' || m == 'fp') {
                DefaultModule.init();
            }
        }
        else {
            DefaultModule.init();
        }
        var world = urlParams.world;
        if (!_.isUndefined(world)) {
            Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = world;
        }
        FiercePlanet.Game.loadGame();
    })
    .script("paperjs-0.22/lib/paper.js")



// For RequireJS
/*
require([
    'fp/core/Universe.js'
    , 'fp/core/agent.js'
    , 'fp/core/catastrophe.js'
    , 'fp/core/culture.js'
    , 'fp/core/world.js'
    , 'fp/core/resource.js'
    , 'fp/core/species.js'
    , 'fp/core/terrain.js'
    , 'fp/core/tile.js'

    , 'fp/models/profile.js'
    , 'fp/models/profile_class.js'
    , 'fp/models/notice.js'
    , 'fp/models/event.js'

    , 'fp/data/resource_types.js'
    , 'fp/data/resourceset/tbl.js'
    , 'fp/data/resourceset/cos.js'
    , 'fp/data/player_classes.js'
    , 'fp/data/default_cultures.js'

    , 'fp/db/fp-db.js'

    , 'fp/dev.js'

    , 'fp/data/worlds.js'

    , 'fp/ui/dialogs.js'
    , 'fp/ui/drawing.js'
    , 'fp/ui/editor.js'
    , 'fp/ui/general-ui.js'
    , 'fp/ui/world-ui.js'
    , 'fp/ui/orientation.js'
    , 'fp/ui/profile-ui.js'
    , 'fp/ui/resource-ui.js'
    , 'fp/ui/google-map.js'
    , 'fp/ui/isometric.js'

    , 'fp/lifecycle.js'
    , 'fp/params.js'
    , 'fp/recording.js'
    , 'fp/utils/utils.js'
    , 'fp/utils/comms.js'
    , 'fp/utils/log.js'
    , 'fp/game.js'

], function() {
    //This function is called when all the scripts are loaded
        $('.thumbnail, .customWorld').click(FiercePlanet.GeneralUI.changePresetWorldDirectly);
        FiercePlanet.GeneralUI.highlightGalleryItem(Lifecycle.currentWorldNumber);
        $('#difficulty-input-' + FiercePlanet.levelOfDifficulty).attr('checked', 'checked');
        $(".difficultyInput").click(FiercePlanet.GeneralUI.changeDifficulty);


        Lifecycle.loadGame();

        FiercePlanet.Utils.bindVariables();


          // Remove text selection - TODO: needs to be more granular
          // document.onselectstart = function() {return false;} // ie
          // document.onmousedown = function() {return false;} // mozilla

          // Default to 3d
          Universe.settings.isometricView = true;
          $('#3d')[0].innerHTML = 'View 2D';
          FiercePlanet.Drawing.drawGame();
          FiercePlanet.WorldUI.makeWorldFromJSON(!{JSON.stringify(serverWorld)});

});
*/