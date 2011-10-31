
$LAB
    .setOptions({BasePath:'/javascripts/'})
   .script("jquery/jquery.min.js")
    .wait()
    .script(['/javascripts/jquery-jquery-ui-fe1b0dc/ui/jquery.ui.core.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.widget.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.mouse.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.accordion.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.autocomplete.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.button.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.datepicker.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.dialog.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.draggable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.droppable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.position.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.progressbar.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.resizable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.selectable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.slider.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.sortable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.tabs.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.core.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.blind.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.bounce.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.clip.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.drop.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.explode.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.fold.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.highlight.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.pulsate.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.scale.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.shake.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.slide.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.transfer.js'])
   .script("jquery.mousewheel.3.0.2/jquery.mousewheel.js")
   .script("jquery/jquery.zoom.js")
   .script("spin.js/spin.min.js")
   .script("sylvester/sylvester.js")
   .script("flot-0.7/flot/jquery.flot.min.js")
   .script("jstat-1.0.0/js/jstat-0.1.0.min.js")
   .script("jpicker-1.1.6/jpicker-1.1.6.js")
   //.script("socket.io/socket.io.js")
   .script("jq-console/demo/jqconsole-min.js")
   .script("/socket.io/socket.io.js")
    .wait()
   .script('fp/utils/jqconsole-helper.js')
    .wait()
   .script([
        '/javascripts/fp/framework/world.js'
       , '/javascripts/fp/framework/agent.js'
       , '/javascripts/fp/framework/catastrophe.js'
       , '/javascripts/fp/framework/culture.js'
       , '/javascripts/fp/framework/level.js'
       , '/javascripts/fp/framework/resource.js'
       , '/javascripts/fp/framework/species.js'
       , '/javascripts/fp/framework/terrain.js'
       , '/javascripts/fp/framework/tile.js'
       , '/javascripts/fp/framework/maze-strategies.js'

       , '/javascripts/fp/fp-models/profile.js'
       , '/javascripts/fp/fp-models/profile_class.js'
       , '/javascripts/fp/fp-models/notice.js'
       , '/javascripts/fp/fp-models/event.js'

       , '/javascripts/fp/fp-data/resource_types.js'
       , '/javascripts/fp/fp-data/resourceset/tbl.js'
       , '/javascripts/fp/fp-data/resourceset/cos.js'
       , '/javascripts/fp/fp-data/player_classes.js'
       , '/javascripts/fp/fp-data/agent_types.js'

       , '/javascripts/fp/fp-db/fp-db.js'


       , '/javascripts/fp/fp-ui/dialogs.js'
       , '/javascripts/fp/fp-ui/drawing.js'
       , '/javascripts/fp/fp-ui/editor.js'
       , '/javascripts/fp/fp-ui/general-ui.js'
       , '/javascripts/fp/fp-ui/level-ui.js'
       , '/javascripts/fp/fp-ui/orientation.js'
       , '/javascripts/fp/fp-ui/profile-ui.js'
       , '/javascripts/fp/fp-ui/resource-ui.js'
       , '/javascripts/fp/fp-ui/google-map.js'
       , '/javascripts/fp/fp-ui/isometric.js'

       , '/javascripts/fp/lifecycle.js'
       , '/javascripts/fp/params.js'
       , '/javascripts/fp/recording.js'
       , '/javascripts/fp/utils/utils.js'
       , '/javascripts/fp/utils/comms.js'
       , '/javascripts/fp/utils/log.js'
       , '/javascripts/fp/game.js'
   ])
    .wait()
    .script([
     '/javascripts/fp/dev.js'

    , '/javascripts/fp/fp-data/levels.js'
    ])
    .wait(function() {
        $(document).ready(function() {
            //This function is called when all the scripts are loaded
                $('.thumbnail, .customLevel').click(FiercePlanet.GeneralUI.changePresetLevelDirectly);
                FiercePlanet.GeneralUI.highlightGalleryItem(FiercePlanet.currentLevelNumber);
                $('#difficulty-input-' + FiercePlanet.levelOfDifficulty).attr('checked', 'checked');
                $(".difficultyInput").click(FiercePlanet.GeneralUI.changeDifficulty);

                FiercePlanet.PresetLevels.init();

                FiercePlanet.Lifecycle.loadGame();

                FiercePlanet.Utils.bindVariables();


                  // Remove text selection - TODO: needs to be more granular
                  // document.onselectstart = function() {return false;} // ie
                  // document.onmousedown = function() {return false;} // mozilla

                  // Default to 3d
                  World.settings.skewTiles = true;
                  $('#3d')[0].innerHTML = 'View 2D';
                  FiercePlanet.Drawing.drawGame();
    //              FiercePlanet.LevelUI.makeLevelFromJSON(!{JSON.stringify(serverLevel)});
        });
    });



// For RequireJS
/*
require([
    '/javascripts/fp/framework/world.js'
    , '/javascripts/fp/framework/agent.js'
    , '/javascripts/fp/framework/catastrophe.js'
    , '/javascripts/fp/framework/culture.js'
    , '/javascripts/fp/framework/level.js'
    , '/javascripts/fp/framework/resource.js'
    , '/javascripts/fp/framework/species.js'
    , '/javascripts/fp/framework/terrain.js'
    , '/javascripts/fp/framework/tile.js'

    , '/javascripts/fp/fp-models/profile.js'
    , '/javascripts/fp/fp-models/profile_class.js'
    , '/javascripts/fp/fp-models/notice.js'
    , '/javascripts/fp/fp-models/event.js'

    , '/javascripts/fp/fp-data/resource_types.js'
    , '/javascripts/fp/fp-data/resourceset/tbl.js'
    , '/javascripts/fp/fp-data/resourceset/cos.js'
    , '/javascripts/fp/fp-data/player_classes.js'
    , '/javascripts/fp/fp-data/agent_types.js'

    , '/javascripts/fp/fp-db/fp-db.js'

    , '/javascripts/fp/dev.js'

    , '/javascripts/fp/fp-data/levels.js'

    , '/javascripts/fp/fp-ui/dialogs.js'
    , '/javascripts/fp/fp-ui/drawing.js'
    , '/javascripts/fp/fp-ui/editor.js'
    , '/javascripts/fp/fp-ui/general-ui.js'
    , '/javascripts/fp/fp-ui/level-ui.js'
    , '/javascripts/fp/fp-ui/orientation.js'
    , '/javascripts/fp/fp-ui/profile-ui.js'
    , '/javascripts/fp/fp-ui/resource-ui.js'
    , '/javascripts/fp/fp-ui/google-map.js'
    , '/javascripts/fp/fp-ui/isometric.js'

    , '/javascripts/fp/lifecycle.js'
    , '/javascripts/fp/params.js'
    , '/javascripts/fp/recording.js'
    , '/javascripts/fp/utils/utils.js'
    , '/javascripts/fp/utils/comms.js'
    , '/javascripts/fp/utils/log.js'
    , '/javascripts/fp/game.js'

], function() {
    //This function is called when all the scripts are loaded
        $('.thumbnail, .customLevel').click(FiercePlanet.GeneralUI.changePresetLevelDirectly);
        FiercePlanet.GeneralUI.highlightGalleryItem(FiercePlanet.currentLevelNumber);
        $('#difficulty-input-' + FiercePlanet.levelOfDifficulty).attr('checked', 'checked');
        $(".difficultyInput").click(FiercePlanet.GeneralUI.changeDifficulty);

        console.log('a');
        FiercePlanet.PresetLevels.init();
        console.log('b  ');

        FiercePlanet.Lifecycle.loadGame();

        FiercePlanet.Utils.bindVariables();


          // Remove text selection - TODO: needs to be more granular
          // document.onselectstart = function() {return false;} // ie
          // document.onmousedown = function() {return false;} // mozilla

          // Default to 3d
          World.settings.skewTiles = true;
          $('#3d')[0].innerHTML = 'View 2D';
          FiercePlanet.Drawing.drawGame();
          FiercePlanet.LevelUI.makeLevelFromJSON(!{JSON.stringify(serverLevel)});

});
*/