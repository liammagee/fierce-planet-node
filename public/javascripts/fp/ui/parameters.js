/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains parameters functions
 */
FiercePlanet.Parameters = FiercePlanet.Parameters || {};

(function() {

    var parametersDialog;

    /**
     */
    this.openDialog = function () {
        graphMap = {
                'pop-count': this.PopulationStats
                , 'pop-health': this.HealthStats
                , 'saved-expired': this.SavedExpiredStats
                , 'hdi': this.HDIStats
                , 'hpi': this.HPIStats
            };

        if (!parametersDialog) {
            parametersDialog = $('#parameters-dialog')
                .dialog({
                   position: [1100, 35],
                   width: 550,
                   height: 560,
                    autoOpen: false,
                    modal: false,
                    title: 'Fierce Planet Graph',
                    buttons: {
                        "Cancel": function() {
                            $( this ).dialog( "close" );
                        }
                    }

                });

        }
        graphDialog.dialog('open');
    };

    /**
     * Resets the flot graph
     */
    this.drawGraph = function () {
        if ($("#world-graph")[0]) {
            $("#world-graph").show();
            this.refreshGraph();
            plotUpdateInterval = 50;
            this.updateGraph();
        }
    };

    /**
     * Resets the flot graph
     */
    this.refreshGraph = function () {
        if ($("#world-graph")[0]) {
            counter = 0;
            plotStats = this.PopulationStats;
            plot = plotStats.setup();
        }
    };

    /**
     * Closes the flot graph
     */
    this.clearGraph = function () {
        if ($("#world-graph")[0]) {
            $("#world-graph").hide();
            plot = null;
            plotUpdateInterval = 250;
            clearTimeout(plotIntervalId);
        }
    };

    /**
     * Updates the flot graph
     */
    this.updateGraph = function() {
        if ($("#world-graph")[0] && Universe.settings.showGraph) {
//            if (true) {
            if (FiercePlanet.Game.inPlay) {
                plotStats.update(plot);
                counter++;

                // Do this less often
                var updateInterval = 1;
                if (counter % updateInterval == 0) {
                    plot.setupGrid();
                    plot.draw();
                }
            }
            plotIntervalId = setTimeout(FiercePlanet.Graph.updateGraph, plotUpdateInterval);
        }
    };

    // Different stats models
    this.PopulationStats =  {
            setup: function() {
                var yAxisMax = Lifecycle.numAgents;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: yAxisMax }
                };
                var seedData = [];
                var cultures = ModuleManager.currentModule.allCultures();
                for (var i = 0, l = cultures.length; i < l; i++) {
                    var as = cultures[i];
                    seedData.push({ color: as.color, data: [[0, Lifecycle.numAgents]], lines: { show: true } });
                }
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (Lifecycle.worldCounter > 0) {
                    var cultures = ModuleManager.currentModule.allCultures();
                    var j = 0;
                    for (var i = 0, l = cultures.length; i < l; i++) {
                        var as = cultures[i];
                        var counter = 0;
                        Lifecycle.currentWorld.currentAgents.forEach(function(a) {if (a.culture.name == as.name) counter++} )
                        var d = [Lifecycle.worldCounter, counter];
                        j++;
                        data[i].data.push(d);
                    }
                }
                plot.setData(data);
            }
        };

    this.HealthStats =  {
            setup: function() {
                var totalSaveable = 100;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: totalSaveable }
                };
                var seedData = [];
                for (var i = 0, l = ModuleManager.currentModule.resourceSet.categories.length; i < l; i++) {
                    var cat = ModuleManager.currentModule.resourceSet.categories[i];
                    seedData.push({ color: cat.color, data: [[0, 100]], lines: { show: true } });
                }
                seedData.push({ color: '#333', data: [[0, 100]], lines: { show: true } });
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (Lifecycle.worldCounter > 0) {
                    var stats = Lifecycle.currentWorld.currentAgentHealthStats();
                    var j = 0;
                    for (var i in stats) {
                        if (stats.hasOwnProperty(i)) {
                            var d = [Lifecycle.worldCounter, stats[i]];
                            data[j].data.push(d);
                            j++;
                        }
                    }
//                    data[j].data.push([FiercePlanet.worldCounter, stats.total])
                }
                plot.setData(data);
            }
        };

    this.SavedExpiredStats =  {
            setup: function() {
                var totalSaveable = FiercePlanet.currentWorld ? FiercePlanet.currentWorld.getTotalSaveableAgents() : 55;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: totalSaveable }
                };
                var seedData = [];
                seedData.push({ color: '#0f0', data: [[0, 0]], lines: { show: true } });
                seedData.push({ color: '#f00', data: [[0, 0]], lines: { show: true } });
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (Lifecycle.worldCounter > 0) {
                    var savedData = data[0].data;
                    var expiredData = data[1].data;
                    savedData.push([Lifecycle.worldCounter, FiercePlanet.Game.currentProfile.currentWorldSaved]);
                    expiredData.push([Lifecycle.worldCounter, FiercePlanet.Game.currentProfile.currentWorldExpired]);
                }
                plot.setData(data);
            }
        };

    /**
     * TODO: Requires use of TBL resource set.
     */
    this.HDIStats =  {
            setup: function() {
                var totalSaveable = 100;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: totalSaveable }
                };
                var seedData = [];
                for (var i = 0, l = ModuleManager.currentModule.resourceSet.categories.length; i < l; i++) {
                    var cat = ModuleManager.currentModule.resourceSet.categories[i];
                    seedData.push({ color: cat.color, data: [[0, 100]], lines: { show: true } });
                }
                seedData.push({ color: '#333', data: [[0, 100]], lines: { show: true } });
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (Lifecycle.worldCounter > 0) {
                    var stats = Lifecycle.currentWorld.currentAgentHealthStats();
                    var j = 0;
                    for (var i in stats) {
                        if (stats.hasOwnProperty(i)) {
                            var d = [Lifecycle.worldCounter, stats[i]];
                            data[j].data.push(d);
                            j++;
                        }
                    }
//                    data[j].data.push([FiercePlanet.worldCounter, stats.total])
                }
                plot.setData(data);
            }
        };

    this.HPIStats =  {
            setup: function() {
                var totalSaveable = 100;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: totalSaveable }
                };
                var seedData = [];
                // Only one data point
                seedData.push({ color: '#333', data: [[0, 100]], lines: { show: true } });
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (Lifecycle.worldCounter > 0) {
                    var stats = Lifecycle.currentWorld.currentAgentHealthStats();
                    var j = 0;
                    for (var i in stats) {
                        if (stats.hasOwnProperty(i)) {
                            var d = [Lifecycle.worldCounter, stats[i]];
                            data[j].data.push(d);
                            j++;
                        }
                    }
//                    data[j].data.push([FiercePlanet.worldCounter, stats.total])
                }
                plot.setData(data);
            }
        };




}).apply(FiercePlanet.Parameters);
