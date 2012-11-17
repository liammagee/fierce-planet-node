/*!
 * Fierce Planet - ResourceUI
 * Functions for handling resource-related UI events
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains resource UI functions
 */
FiercePlanet.ResourceUI = FiercePlanet.ResourceUI || {};

(function() {

    /**
     * Handle various resource-related interactions
     */
    this.setupResourceInteraction = function () {
        var topMostCanvas = FiercePlanet.GeneralUI.getTopMostCanvas();
            var links = $('.swatch-draggable'), el = null;
            for (var i = 0; i < links.length; i++) {
                el = links[i];
                if (el.id && $.inArray(el.id, FiercePlanet.Game.currentProfile.capabilities) != -1) {
                    $('#' + el.id).draggable({
//                    appendTo: agentCanvas,
//                    containment: agentCanvas,
//                    grid: [FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight],
                        cursor: "pointer",
                        helper: "clone",
                        zIndex: 1000,
                        start: function(event, ui) {
                            if (event.originalEvent)
                                event = event.originalEvent;
                            FiercePlanet.Game.currentResourceId = this.id;
                        },
	                    drag: function(event, ui) {
                            if (event.originalEvent)
                                event = event.originalEvent;
	                        FiercePlanet.Drawing.drawGuideCell(event);
	                    },
						stop: function(event, ui) {
                            if (event.originalEvent)
                                event = event.originalEvent;
							FiercePlanet.Drawing.clearGuide();
						}
                    });
                    $('#' + el.id).click(function() {
                        FiercePlanet.Game.currentResourceId = this.id;
                    });
                }
            }
            topMostCanvas.droppable({
                drop: function( event, ui ) {
                    if (event.originalEvent)
                        event = event.originalEvent;
                    var position = $(this).offset();
                    var x = event.pageX - position.left;
                    var y = event.pageY - position.top;
                    var currentPosition = FiercePlanet.GeneralUI.getCurrentPositionByCoordinates(x,y);
                    FiercePlanet.ResourceUI.dropItem(currentPosition.posX, currentPosition.posY);
                }
            });

        };


    /**
     * Process click on the resource canvas
     *
     * @param e
     */
    this.processResourceCanvasClick = function(e) {
        // Don't do anything if moving
        FiercePlanet.isMouseDown = false;
        if (FiercePlanet.isMouseMoving)
            return;
        var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
        var posX = __ret.posX;
        var posY = __ret.posY;
        var foundResource = false;
        for (var i = 0; i < Lifecycle.currentWorld.resources.length; i++) {
            var resource = Lifecycle.currentWorld.resources[i];
            if (resource.x == posX && resource.y == posY) {
                FiercePlanet.Game.currentResource = resource;
                if (confirm("Are you sure you want to delete this resource?")) {
                    FiercePlanet.ResourceUI.deleteCurrentResource();
                }
                // Do this only if we want more than a simple delete option
//            FiercePlanet.$upgradeDelete.dialog('open');
                return;
            }
        }
        var areAgentsAllowed = Lifecycle.currentWorld.areAgentsAllowed(posX, posY);
        if (Universe.settings.tilesMutable) {
            if (areAgentsAllowed) {
                var cell = Lifecycle.currentWorld.getCell(posX, posY);
                cell.agentsAllowed = false;
                Lifecycle.currentWorld.forbidAgentOnCell(posX, posY);
                FiercePlanet.Drawing.drawCanvases();
            }
            else if (!foundResource && FiercePlanet.Game.currentResourceId != null) {
                FiercePlanet.ResourceUI.dropItem(posX, posY);
            }
            else {
                var cell = Lifecycle.currentWorld.getCell(posX, posY);
                cell.agentsAllowed = true;
//                Lifecycle.currentWorld.removeTile(posX, posY);
                FiercePlanet.Drawing.drawCanvases();
            }
        }
        else if (!foundResource) {
            if (FiercePlanet.Game.currentResourceId != null) {
                FiercePlanet.ResourceUI.dropItem(posX, posY);
            }
            else if (Universe.settings.useInlineResourceSwatch) {
                FiercePlanet.ResourceUI.showInlineResourcePanel(e);

            }
        }
        FiercePlanet.Game.isMouseDown = false;

    };

    /**
     * Shows an inline resource panel
     */
    this.showInlineResourcePanel = function(e) {
        var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
        var posX = __ret.posX;
        var posY = __ret.posY;
        if (Lifecycle.currentWorld.areAgentsAllowed(posX, posY) && ! Lifecycle.currentWorld.allowResourcesOnPath)
            return;
        if (Lifecycle.currentWorld.isPositionOccupiedByResource(posX, posY))
            return;

        var dialogX = FiercePlanet.Dialogs.calculateWorldLeft();
        var dialogY = FiercePlanet.Dialogs.calculateWorldTop();
        var coords = FiercePlanet.GeneralUI.getWorldCoordinates(e);
        var x = coords.x;
        var y = coords.y;
        var width = 200, height = 240;
        posX = dialogX + x - (width / 2);
        posY = dialogY + y - (height / 2);
        posX = (posX < dialogX ? dialogX : (posX + width > dialogX + FiercePlanet.Orientation.worldWidth ? (dialogX + FiercePlanet.Orientation.worldWidth - width) : posX));
        posY = (posY < dialogY ? dialogY : (posY + height > dialogY + FiercePlanet.Orientation.worldHeight ? (dialogY + FiercePlanet.Orientation.worldHeight - height) : posY));

        var swatchCopy = $('#swatch').clone();
        swatchCopy.attr('id', 'inline-swatch');
        swatchCopy.css('left', 0);
        swatchCopy.css('top', 0);
        //FiercePlanet.drawInlineSwatch()
        FiercePlanet.inlineResourcePanel = $('<div></div>')
            .html(swatchCopy)
            .dialog({
               title: 'Add a Resource',
                position: [posX, posY],
                width: width,
                height: height,
                autoOpen: false
//              , modal: true
            });
        $('#inline-swatch div[class="title"]').remove();
        var links = $('#inline-swatch .swatch-draggable'), el = null;
        for (var i = 0; i < links.length; i++) {
            el = links[i];
            console.log(el.id)
            if (el.id && $.inArray(el.id, FiercePlanet.Game.currentProfile.capabilities) != -1) {
                el.addEventListener('click', function (event) {
                    var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
                    var posX = __ret.posX;
                    var posY = __ret.posY;
                    if (Lifecycle.currentWorld.areAgentsAllowed(posX, posY) && ! Lifecycle.currentWorld.allowResourcesOnPath)
                        return;
                    if (Lifecycle.currentWorld.isPositionOccupiedByResource(posX, posY))
                        return;

                    FiercePlanet.Game.currentResourceId = this.id;
                    FiercePlanet.ResourceUI.dropItem(posX, posY);
                    FiercePlanet.Game.currentResourceId = null;
                    FiercePlanet.inlineResourcePanel.dialog('close');
                }, false);

            }
        }
        FiercePlanet.inlineResourcePanel.dialog('open');
    };


    /**
     * Delete the current resource
     */
    this.deleteCurrentResource = function () {
        var foundResource = Lifecycle.currentWorld.getCurrentResourceIndex(FiercePlanet.Game.currentResource);
        if (foundResource > -1) {
            FiercePlanet.Game.currentProfile.currentWorldResourcesInStore += 5;
            FiercePlanet.Game.currentProfile.currentWorldResourcesSpent -= 5;
//            Lifecycle.currentWorld.resources.splice(foundResource, 1);
            Lifecycle.currentWorld.removeResource(FiercePlanet.Game.currentResource);
            FiercePlanet.Drawing.drawResourcesInStore();
            FiercePlanet.Drawing.clearResource(FiercePlanet.Game.currentResource);
        }
    };


    /**
     * Upgrade the current page (NOT E: SHOULD BE TIED TO PROFILE CAPABILITIES
     */
    this.upgradeCurrentResource = function () {
            var foundResource = Lifecycle.currentWorld.getCurrentResourceIndex(FiercePlanet.Game.currentResource);
            if (foundResource > -1) {
                var resource = Lifecycle.currentWorld.resources[foundResource];
                if (resource.upgradeWorld <= 4 && FiercePlanet.Game.currentProfile.currentWorldResourcesInStore >= resource.upgradeCost) {
                    FiercePlanet.Game.currentProfile.currentWorldResourcesInStore -= resource.upgradeCost;
                    FiercePlanet.Game.currentProfile.currentWorldResourcesSpent += resource.upgradeCost;
                    resource.upgradeWorld = resource.upgradeWorld + 1;
                    FiercePlanet.Drawing.drawResource(resource);
                    FiercePlanet.Drawing.drawResourcesInStore();
                }
            }
        };

    /**
     * 'Drops' a selected resource on the tile
     * @param posX - the x coordinate to drop the resource on
     * @param posY - the y coordinate to drop the resource on
     */
    this.dropItem = function(posX, posY) {
        if (Lifecycle.currentWorld.areAgentsAllowed(posX, posY) && ! Lifecycle.currentWorld.allowResourcesOnPath)
            return;
//        if (! Lifecycle.currentWorld.getCell(posX, posY).resourcesAllowed)
//            return;
        if (Lifecycle.currentWorld.isPositionOccupiedByResource(posX, posY))
            return;

        var resourceCode = FiercePlanet.Game.currentResourceId;
//    if (e.dataTransfer)
//        resourceCode = e.dataTransfer.getData('Text');

        var resourceType = ModuleManager.currentModule.resolveResourceType(resourceCode);
        var resource = new Resource(resourceType, posX, posY);

        if (FiercePlanet.Game.currentProfile.currentWorldResourcesInStore < resource.cost) {
            FiercePlanet.Game.currentNotice = new Notice('Not enough resources for now - save some more agents!');
            return;
        }
        else {
            FiercePlanet.Game.currentProfile.spendResource(resource);
            Lifecycle.currentWorld.addResource(resource);

            FiercePlanet.Drawing.drawResources();
//            FiercePlanet.Drawing.drawResource(resource);
            FiercePlanet.Drawing.drawResourcesInStore();

            FiercePlanet.Game.eventTarget.fire(new Event("resource", resource, "added", Lifecycle.universeCounter, Lifecycle.currentWorld));
            if (Universe.settings.sendEventsToServer) {
                FiercePlanet.Comms.notifyServerOfEvent('resources', Lifecycle.currentWorld.resources);
//                notifyEvent('resource', resource);
            }
        }
        if (Universe.settings.useInlineResourceSwatch)
            FiercePlanet.Game.currentResourceId = null;

        // Make sure Firefox does not follow links
        return false;
    };


    /**
     * Draw swatches
     */
    this.initialiseAndLoadResources = function () {
        if (_.isUndefined(ModuleManager.currentModule.resourceSet))
            return;
        $('#swatch').empty();
        $('#gallery-items').empty();
        for (var i = 0; i < ModuleManager.currentModule.resourceSet.categories.length; i++) {
            var category = ModuleManager.currentModule.resourceSet.categories[i];

            // Add to swatch
            var swatchCategoryHTML = '<div class="swatch-category" id="' + category.code + '"></div>';
            $('#swatch').append(swatchCategoryHTML);
            var swatchCategoryElement = $('#' + category.code);
            var swatchCategoryTitleHTML = '<div class="title">' + category.name + '</div>';
            swatchCategoryElement.append(swatchCategoryTitleHTML);
            swatchCategoryElement.css('background', category.color);

            // Add to gallery
            var galleryCategoryHTML = '<div class="gallery-category" id="gallery-' + category.code + '"></div>';
            $('#gallery-items').append(galleryCategoryHTML);
            var galleryCategoryElement = $('#gallery-' + category.code);
            var galleryCategoryTitleHTML = '<div class="title">' + category.name + '</div>';
            galleryCategoryElement.append(galleryCategoryTitleHTML);
            galleryCategoryElement.css('background', category.color);

            var categoryInstanceCounter = 0;
            for (var j = 0; j < category.types.length; j++) {
                var resourceType = category.types[j];
                    var swatchInstanceHTML =
                        '<div class="swatch-instance" title="' + resourceType.name + '">' +
                            '<div class="swatch-draggable" id="' + resourceType.code + '"><img src="' + resourceType.image + '" alt=""></div>' +
                            '<div>' + resourceType.cost + '</div>' +
                            '</div>'
                        ;
                    swatchCategoryElement.append(swatchInstanceHTML);
                    var swatchInstanceElement = $('#' + resourceType.code);
//            swatchInstanceElement.css({'background': '#' + CATEGORY.color});
                    if (categoryInstanceCounter > 0) {
                        swatchInstanceElement.addClass('inactive');
                    }

                    var galleryInstanceHTML =
                        '<div class="swatch-instance inactive purchase" id="' + resourceType.code + '-purchase" title="' + resourceType.name + '">' +
                            '<img src="' + resourceType.image + '" alt="">' +
                            '</div>';
//            var galleryInstanceHTML =
//                    '<div class="swatch-instance purchase inactive" id="' + resourceType.code + '-purchase" title="' + resourceType.name + '">' +
//                        '<img src="' + resourceType.image + '" alt="">' +
//                    '</div>';
                    galleryCategoryElement.append(galleryInstanceHTML);

                    // Increment the category instance
                    categoryInstanceCounter++;

            }
        }
    };



}).apply(FiercePlanet.ResourceUI);

