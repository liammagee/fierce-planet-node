/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains graph functions
 */
FiercePlanet.Graph = FiercePlanet.Graph || {};

(function() {
    var plot;
    var plotUpdateInterval;
    var plotIntervalId;
    var plotStats;
    var counter;

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
            // Change to another function
            plotStats = this.PopulationStats;
//            plotStats = this.HealthStats;
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
        if ($("#world-graph")[0] && World.settings.showGraph) {
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

    this.HealthStats =  {
            setup: function() {
                var totalSaveable = 100;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: totalSaveable }
                };
                var seedData = [];
                for (var i in World.resourceCategories) {
                    var cat = World.resourceCategories[i];
                    seedData.push({ color: cat.color, data: [[0, 100]], lines: { show: true } });
                }
                seedData.push({ color: '#333', data: [[0, 100]], lines: { show: true } });
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (FiercePlanet.Game.levelCounter > 0) {
                    var stats = FiercePlanet.Game.currentLevel.currentAgentHealthStats();
                    var j = 0;
                    for (var i in stats) {
                        var d = [FiercePlanet.Game.levelCounter, stats[i]];
                        data[j].data.push(d);
                        j++;
                    }
//                    data[j].data.push([FiercePlanet.levelCounter, stats.total])
                }
                plot.setData(data);
            }
        };

    this.SavedExpiredStats =  {
            setup: function() {
                var totalSaveable = FiercePlanet.currentLevel ? FiercePlanet.currentLevel.getTotalSaveableAgents() : 55;
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
                if (FiercePlanet.Game.levelCounter > 0) {
                    var savedData = data[0].data;
                    var expiredData = data[1].data;
                    savedData.push([FiercePlanet.Game.levelCounter, FiercePlanet.Game.currentProfile.currentLevelSaved]);
                    expiredData.push([FiercePlanet.Game.levelCounter, FiercePlanet.Game.currentProfile.currentLevelExpired]);
                }
                plot.setData(data);
            }
        };

    this.HDIStats =  {
            setup: function() {
                var totalSaveable = 100;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: totalSaveable }
                };
                var seedData = [];
                for (var i in World.resourceCategories) {
                    var cat = World.resourceCategories[i];
                    seedData.push({ color: cat.color, data: [[0, 100]], lines: { show: true } });
                }
                seedData.push({ color: '#333', data: [[0, 100]], lines: { show: true } });
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (FiercePlanet.Game.levelCounter > 0) {
                    var stats = FiercePlanet.Game.currentLevel.currentAgentHealthStats();
                    var j = 0;
                    for (var i in stats) {
                        var d = [FiercePlanet.Game.levelCounter, stats[i]];
                        data[j].data.push(d);
                        j++;
                    }
//                    data[j].data.push([FiercePlanet.levelCounter, stats.total])
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
                for (var i in World.resourceCategories) {
                    var cat = World.resourceCategories[i];
                    seedData.push({ color: cat.color, data: [[0, 100]], lines: { show: true } });
                }
                seedData.push({ color: '#333', data: [[0, 100]], lines: { show: true } });
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (FiercePlanet.Game.levelCounter > 0) {
                    var stats = FiercePlanet.Game.currentLevel.currentAgentHealthStats();
                    var j = 0;
                    for (var i in stats) {
                        var d = [FiercePlanet.Game.levelCounter, stats[i]];
                        data[j].data.push(d);
                        j++;
                    }
//                    data[j].data.push([FiercePlanet.levelCounter, stats.total])
                }
                plot.setData(data);
            }
        };

    this.PopulationStats =  {
            setup: function() {
                var yAxisMax = FiercePlanet.Game.numAgents;
                var options = {
                    series: { shadowSize: 0 }, // drawing is faster without shadows
                    yaxis: { min: 0, max: yAxisMax }
                };
                var seedData = [];
                var agentSets = FiercePlanet.ModuleManager.currentModule.allAgentSets();
                for (var i in agentSets) {
                    var as = agentSets[i];
                    seedData.push({ color: as.color, data: [[0, FiercePlanet.Game.numAgents]], lines: { show: true } });
                }
                return $.plot($("#world-graph"), seedData, options);
            },
            update: function(plot) {
                var data = plot.getData();
                if (FiercePlanet.Game.levelCounter > 0) {
                    var agentSets = FiercePlanet.ModuleManager.currentModule.allAgentSets();
                    var j = 0;
                    for (var i in agentSets) {
                        var as = agentSets[i];
                        var counter = 0;
                        FiercePlanet.Game.currentLevel.currentAgents.forEach(function(a) {if (a.agentType.name == as.name) counter++} )
                        var d = [FiercePlanet.Game.levelCounter, counter];
                        j++;
                        data[i].data.push(d);
                    }
                }
                plot.setData(data);
            }
        };



}).apply(FiercePlanet.Graph);
