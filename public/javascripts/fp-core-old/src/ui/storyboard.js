/*!
 * Fierce Planet - Utils
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */




var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains development functions
 */
FiercePlanet.Storyboard = FiercePlanet.Storyboard || {};

(function() {

    /**
     * Shows the narrative for FP
     */
    this.showStoryboard = function() {
        var storyboard = '';
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world0);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world1);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world2);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world3);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world4);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world5);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world6);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world7);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world8);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world9);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world10);
        storyboard += FiercePlanet.Dev.buildStoryboardForWorld(FiercePlanet.PresetWorlds.world11);

        var storyboardWindow =  window.open('','RecipeWindow','width=600,height=600');
        var html = '<html><head><title>FiercePlanet Storyboard</title></head><body><div id="storyboard">' +
                $('<div></div>').append($(storyboard).clone()).html() +
                '</div></body></html>';
        storyboardWindow.document.open();
        storyboardWindow.document.write(html);
        storyboardWindow.document.close();

        return false;
        /*
        var showNarrative = $('<div></div>')
            .html(storyboard)
            .dialog({
                position: [10, 10],
                width: $(document).width() - 20,
                height: $(document).height() - 20,
                autoOpen: false,
                modal: true,
                title: 'Fierce Planet Storyboard',
                buttons: {
                    "OK": function() {
                        $( this ).dialog( "close" );
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
        showNarrative.dialog('open');
        */
    };

    /**
     * Shows the narrative for FP
     */
    this.buildStoryboardForWorld = function(world) {
        var worldStoryboard = '';
        if (world.name)
            worldStoryboard += '<h3>' + world.name + '</h3>';
        worldStoryboard += '<div>World ID: ' + world.id + '</div>';
        worldStoryboard += '<div>Initial number of agents: ' + world.initialAgentNumber + '</div>';
        worldStoryboard += '<div>Number of waves: ' + world.waveNumber + '</div>';
        worldStoryboard += '<div>Expiry limit: ' + world.expiryLimit + '</div>';
        worldStoryboard += '<div>Initial resource store: ' + world.initialResourceStore + '</div>';
        if (world.image) {
            worldStoryboard += '<h4>World Image</h4>';
            worldStoryboard += '<img src="' + world.image + '" alt="City Image" width="460" height="140">';
        }
        if (world.introduction) {
            worldStoryboard += '<h4>Introduction</h4>';
            worldStoryboard += world.introduction;
        }
        if (world.tip) {
            worldStoryboard += '<h4>Tip</h4>';
            worldStoryboard += world.tip.text;
        }
        if (world.catastrophe) {
            worldStoryboard += '<h4>Catastrohe</h4>';
            worldStoryboard += world.catastrophe.notice.text;
        }
        if (world.conclusion) {
            worldStoryboard += '<h4>Conclusion</h4>';
            worldStoryboard += world.conclusion;
        }
        worldStoryboard += '<hr/>';

        return worldStoryboard;
    };

}).apply(FiercePlanet.Storyboard);
