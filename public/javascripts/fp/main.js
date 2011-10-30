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

});