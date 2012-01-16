/*!
 * Fierce Planet - World
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * World class definition
 *
 * @constructor
 * @param id
 */
function World() {

    this.initWorld = function() {
        this.setCurrentAgents([]);
        this.expiredAgents = [];
        this.generatePath();
        this.initContentMap();
        this.waves = undefined;
        this.resetResources();
        if (this.catastrophe != undefined)
            this.catastrophe.struck = false;

        this.initialiseWaves(this.waveNumber);

        // Set up world
        if (this.setup)
            this.setup();
    };

    // Sets the id, if passed in; otherwise default to 1001
    this.id = 1;

    this.name = undefined;

    this.isPresetWorld = false;
    this.isTerminalWorld = false;
    this.waves = [];
    this.entryPoints = [];
    this.exitPoints = [];

    // Dimensions
    this.cellsAcross = 10, this.cellsDown = 10;

    // Parameters
    this.initialAgentNumber = 1, this.waveNumber = 1, this.expiryLimit = 1;

    this.initialResourceStore = 100;
    this.currentResourceStore = 100;
    this.currentResourceSpent = 0;
    this.initialResourceNumber = 0;

    this.allowOffscreenCycling = false;
    this.allowResourcesOnPath = false;
    this.customWorld = false;
    this.noWander = false;
    this.noSpeedChange = false;
    this.resourcesOwnTilesExclusively = false;

    // Rendering options
    this.isometric = false;

    // Generation options
    this.randomiseAgents = false;
    this.placeAgentsOnAllCells = false;
    this.randomiseResources = false;
    this.generateWaveAgentsAutomatically = true;
    this.incrementAgentsEachWave = true;
    this.generateWaveAgentsAutomatically = true;
    this.distributeAgentsNormally = false;
    this.distributeAgentsSigma = 0;
    this.distributeAgentsHealthNormally = false;
    this.distributeAgentsHealthSigma = 0;


    // Agent variables
    this.cultures = undefined;
    this.currentAgents = [], this.currentAgentsMap = {}, this.currentAgentsFunction = function(agent) {return agent};
    this.worldAgents = [], this.waveAgents = [], this.expiredAgents = [], this.savedAgents = [];

    // Resource variables
    this.worldResources = [], this.resources = [], this.resourceCategoryCounts = [];

    /** Object for storing tiles, resources and other world entities for co-ordinate based look-up */
    this.contentMap = {};
    this.cells = {};
    this.terrainMap = {};
    this.tiles = [];

    // User interface elements
    this.tip = null;
    this.introduction = "Welcome to world " + this.id + ".";
    this.conclusion = "Congratulations! You have completed world " + this.id + ".";
    this.catastrophe = null;

    // Google map, image and sound options
    this.backgroundTerrain = null, this.mapOptions = null, this.mapURL = null;
    this.thumbnail = undefined, this.image = null, this.imageAttribution = null, this.soundSrc = null;
}


/**
 * Retrieves current agents - will filter if a filter agent is available (requires Underscore to be loaded)
 */
World.prototype.getCurrentAgents = function() {
    if (typeof(_) === 'undefined' || _.isUndefined(this.currentAgentsFunction))
        return this.currentAgents;
    else
        return _.filter(this.currentAgents, this.currentAgentsFunction);
};

// Tile functions
/**
 * Gets a tile at the given co-ordinate
 * @param x
 * @param y
 */
World.prototype.getTile = function(x, y) {
    var tilePosition = y * this.cellsAcross + x;
    return this.tiles[tilePosition];
};
/**
 * Gets tiles surrounding a given co-ordinate
 * @param x
 * @param y
 */
World.prototype.getSurroundingTiles = function(x, y) {
    var surroundingTiles = [];

    if (x > 0)
        surroundingTiles.push(this.getTile(x - 1, y));
    if (x < this.cellsAcross - 1)
        surroundingTiles.push(this.getTile(x + 1, y));
    if (y > 0)
        surroundingTiles.push(this.getTile(x, y - 1));
    if (y < this.cellsDown - 1)
        surroundingTiles.push(this.getTile(x, y + 1));

    return surroundingTiles;
};
/**
 *
 */
World.prototype.getTiles = function() { return this.tiles; };
/**
 * 
 * @param tiles
 */
World.prototype.setTiles = function(tiles) {
    this.tiles = tiles;
    this.generatePath();
    this.assignCells();
};
/**
 *
 * @param tile
 */
World.prototype.addTile = function(tile) {
    var position = tile.y * this.cellsAcross + tile.x;
    if (this.tiles[position] != undefined)
        throw new Error("Tile is already occupied!");
    this.tiles[position] = tile;
    this.removeEntryPoint(tile.x, tile.y);
    this.removeExitPoint(tile.x, tile.y);
    this.removeFromPath(tile.x, tile.y);
    this.addCell(tile.x, tile.y, tile);
};

/**
 *
 * @param x
 * @param y
 */
World.prototype.addDefaultTile = function(x, y) {
    this.addTile(new Tile(DEFAULT_TILE_COLOR, x, y));
};
/**
 * 
 * @param x
 * @param y
 */
World.prototype.removeTile = function(x, y) {
    var tilePosition = y * this.cellsAcross + x;
    this.tiles[tilePosition] = undefined;
    // This fails when trying to add back tile at this co-ordinate
//    this.tiles.splice(tilePosition, 1);
    this.annulCell(x, y);
    this.addToPath(x, y);
};

/**
 * Fill all available cells with tiles
 */
World.prototype.fillWithTiles = function() {
    this.tiles = [];
    for (var i = 0; i < this.cellsAcross; i++) {
        for (var j = 0; j < this.cellsDown; j++) {
            var tile = new Tile(DEFAULT_TILE_COLOR, j, i);
            this.tiles.push(tile);
            this.addCell(tile.x, tile.y, tile);
        }
    }
    this.generatePath();
};

/**
 * Remove all tiles from the world
 */
World.prototype.removeAllTiles = function() {
//    this.tiles = [];
//    this.cells = {};
    for (var i = 0; i < this.cellsAcross; i++) {
        for (var j = 0; j < this.cellsDown; j++) {
            var tilePosition = j * this.cellsAcross + i;
            this.tiles[tilePosition] = undefined;
            this.annulCell(i, j);
        }
    }
    this.generatePath();
};
/**
 *
 * @param start
 * @param number
 */
World.prototype.removeTiles = function(start, number) {
    for (var i = start; i < start + number; i++) {
        if (i >= 0 && i < this.tiles.length) {
            var tile = this.tiles[i];
            this.tiles[i] = undefined;
            this.annulCell(tile.x, tile.y);
        }
    }
    this.generatePath();
};

/**
 * Adds default tiles to all cells
 * @param start
 * @param number
 */
World.prototype.addTiles = function(start, number) {
    for (var i = start; i < start + number; i++) {
        if (i >= 0 && i < this.tiles.length) {
            var x = i % this.cellsAcross;
            var y = Math.floor(i / this.cellsAcross);
            var tile = new Tile(DEFAULT_TILE_COLOR, x, y);
            this.tiles[i] = tile;
            this.addCell(tile.x, tile.y, tile);
        }
    }
    this.generatePath();
};

/**
 * Generates a computed path based on the absence of tiles
 */
World.prototype.generatePath = function() {
    var pathCells = [];
    for (var i = 0; i < this.cellsDown; i++) {
        for (var j = 0; j < this.cellsAcross; j++) {
            var tilePosition = i * this.cellsAcross + j;
            if (_.isUndefined(this.tiles[tilePosition]))
                pathCells.push([j, i]);
        }

    }
    this.pathway = pathCells;
    return pathCells;
};

/**
 * Retrieves the index of the co-ordinate in the path variable
 */
World.prototype.isInPath = function(x, y) {
    for (var i = 0; i < this.pathway.length; i++) {
        var coord = this.pathway[i];
        if (coord[0] == x && coord[1] == y)
            return i;
    }
    return -1;
};
/**
 * Add cell to path
 */
World.prototype.addToPath = function(x, y) {
    if (this.isInPath(x, y) == -1)
        this.pathway.push([x, y]);
};
/**
 * Remove cell from path
 */
World.prototype.removeFromPath = function(x, y) {
    var index = this.isInPath(x, y);
    if (index > -1)
        this.pathway.splice(index, 1);
};
/**
 * Adds a particular terrain to all parts of the path
 */
World.prototype.addTerrainToPath = function(terrain) {
    this.terrainMap = {};
    for (var i = 0, l = this.pathway.length; i < l; i++) {
        var path = this.pathway[i];
        this.terrainMap[path] = terrain;
    }
};
/**
 * Adds a particular terrain to the background
 */
World.prototype.addTerrainToBackground = function(terrain) {
    this.backgroundTerrain = terrain;
};


// Cell functions
/**
 *
 */
World.prototype.getCells = function() { return this.cells; };
/**
 * 
 * @param x
 * @param y
 */
World.prototype.getCell = function(x, y) { return this.cells[[x, y]]; };

/**
 *
 * @param cells
 */
World.prototype.setCells = function(cells) { this.cells = cells; };
/**
 * 
 * @param x
 * @param y
 * @param value
 */
World.prototype.addCell = function(x, y, value) {this.cells[[x, y]] = value;};
/**
 *
 * @param x
 * @param y
 */
World.prototype.annulCell = function(x, y) { this.cells[[x, y]] = undefined; };
/**
 *
 */
World.prototype.assignCells = function() {
    this.cells = [];
    for (var i = 0; i < this.tiles.length; i++) {
        var tile = this.tiles[i];
//        if (tile != undefined)
        if (_.isUndefined(tile))
            this.addCell(tile.x, tile.y, tile);
    }
};

// Object functions
World.prototype.initContentMap = function() {
    this.contentMap = {};
    for (var i = 0; i < this.cellsAcross; i++) {
        for (var j = 0; j < this.cellsDown; j++) {
            this.addNewContentToMap(i, j);
        }
    }
    this.updateContentMap();
};
World.prototype.addNewContentToMap = function(x, y) {
    var contents = {};
    contents.resources = [];
    contents.agents = [];
    this.contentMap[[x, y]] = contents;
}

World.prototype.updateContentMap = function() {
    for (var i = 0; i < this.resources.length; i++) {
        var resource = this.resources[i];
        var x = resource.x, y = resource.y;
        var contents = this.contentMap[[x, y]];
        contents.resources.push(resource);
    }
    for (var i = 0; i < this.currentAgents.length; i++) {
        var agent = this.currentAgents[i];
        var x = agent.x, y = agent.y;
        var contents = this.contentMap[[x, y]];
        contents.agents.push(agent);
    }
};
World.prototype.addResourceToContentMap = function(resource) {
    var x = resource.x, y = resource.y;
    var contents = this.contentMap[[x, y]];
    contents.resources.push(resource);
};
World.prototype.removeResourceFromContentMap = function(resource) {
    var x = resource.x, y = resource.y;
    var contents = this.contentMap[[x, y]];
    var foundIndex = -1;
    for (var i = 0; i < contents.resources.length; i++) {
        var r = contents.resources[i];
        if (r == resource)
            foundIndex = i;
    }
    if (foundIndex > -1)
        contents.resources.splice(foundIndex, 1);
};
World.prototype.removeAllResourcesFromContentMap = function() {
    for (var i = 0; i < this.cellsAcross; i++) {
        for (var j = 0; j < this.cellsDown; j++) {
            var content = this.contentMap[[i, j]];
            if (typeof(content) !== 'undefined')
                content.resources = [];
        }
    }
};
World.prototype.changeResourceInContentMap = function(resource, lastX, lastY) {
    var x = resource.x, y = resource.y;
    var lastContents = this.contentMap[[lastX, lastX]];
    var foundIndex = -1;
    for (var i = 0; i < lastContents.resource.length; i++) {
        var r = lastContents.resource[i];
        if (r == resource)
            foundIndex = i;
    }
    if (foundIndex > -1)
        lastContents.resources.splice(foundIndex, 1);

    this.addResourceToContentMap(resource);
};
World.prototype.getResourcesAtContentMap = function(x, y) {
    return this.contentMap[[x, y]].resources;
};
World.prototype.addAgentToContentMap = function(agent) {
    var x = agent.x, y = agent.y;
    var contents = this.contentMap[[x, y]];
    contents.agents.push(agent);
};
World.prototype.removeAgentFromContentMap = function(agent) {
    var x = agent.x, y = agent.y;
    var contents = this.contentMap[[x, y]];
    var foundIndex = -1;
    for (var i = 0; i < contents.agents.length; i++) {
        var a = contents.agents[i];
        if (a == agent)
            foundIndex = i;
    }
    if (foundIndex > -1)
        contents.agents.splice(foundIndex, 1);
};
World.prototype.changeAgentInContentMap = function(agent, lastX, lastY) {
    var x = agent.x, y = agent.y;
    if (typeof(lastX) !== 'undefined' && typeof(lastY) !== 'undefined') {
        var lastContents = this.contentMap[[lastX, lastY]];
        var foundIndex = -1;
        for (var i = 0; i < lastContents.agents.length; i++) {
            var a = lastContents.agents[i];
            if (a == agent)
                foundIndex = i;
        }
        if (foundIndex > -1)
            lastContents.agents.splice(foundIndex, 1);
    }

    this.addAgentToContentMap(agent);
};
World.prototype.removeAllAgentsFromContentMap = function() {
    for (var i = 0; i < this.cellsAcross; i++) {
        for (var j = 0; j < this.cellsDown; j++) {
            var content = this.contentMap[[i, j]];
            if (typeof(content) !== 'undefined')
                content.agents = [];
        }
    }
};
World.prototype.getAgentsAtContentMap = function(x, y) {
    return this.contentMap[[x, y]].agents;
};


// Entry point functions
/**
 *
 * @param x
 * @param y
 */
World.prototype.addEntryPoint = function(x, y) {
    if (!this.isEntryOrExitPoint(x, y))
        this.entryPoints.push([x, y]);
};

/**
 * Resets the entry point collection, leaving only one entry point at co-ordinate (0. 0)
 */
World.prototype.resetEntryPoints = function() {
    this.entryPoints = [];
    this.addEntryPoint(0, 0);
};
/**
 * Removes an entry point at the given co-ordinate
 * @param x
 * @param y
 */
World.prototype.removeEntryPoint = function(x, y) {
    var position = -1;
    for (var i = 0; i < this.entryPoints.length; i++) {
        var point = this.entryPoints[i];
        if (point[0] == x && point[1] == y)
            position = i;
    }
    if (position > -1) {
        this.entryPoints.splice(position, 1);
    }
};
/**
 * Gets the first entry point
 */
World.prototype.getFirstEntryPoint = function() { return this.entryPoints[0]; };

// Exit point functions
/**
 *
 * @param x
 * @param y
 */
World.prototype.isExitPoint = function(x, y) {
    for (var i = 0; i < this.exitPoints.length; i++) {
        var point = this.exitPoints[i];
        if (point[0] == x && point[1]== y) {
            return true;
        }
    }
    return false;
};
/**
 *
 * @param x
 * @param y
 */
World.prototype.addExitPoint = function(x, y) {
    var found = false;
    for (var i = 0; i < this.exitPoints.length; i++) {
        var point = this.exitPoints[i];
        if (point[0] == x && point[1]== y) {
            found = true;
            break;
        }
    }
    if (!found)
        this.exitPoints.push([x, y]);
};
/**
 *
 */
World.prototype.resetExitPoints = function() {
    this.exitPoints = [];
};
/**
 *
 * @param x
 * @param y
 */
World.prototype.removeExitPoint = function(x, y) {
    var position = -1;
    for (var i = 0; i < this.exitPoints.length; i++) {
        var point = this.exitPoints[i];
        if (point[0] == x && point[1] == y)
            position = i;
    }
    if (position > -1) {
        this.exitPoints.splice(position, 1);
    }
};

/**
 * Determines whether a cell at a given co-ordinate is either an entry or an exit point
 * @param x
 * @param y
 */
World.prototype.isEntryOrExitPoint = function(x, y) {
    for (var i = 0, l = this.entryPoints.length; i < l; i++) {
        var point = this.entryPoints[i];
        if (point[0] == x && point[1]== y) {
            return true;
        }
    }
    for (var i = 0, l = this.exitPoints.length; i < l; i++) {
        var point = this.exitPoints[i];
        if (point[0] == x && point[1]== y) {
            return true;
        }
    }
    return false;
};


// Agent functions

/**
 * Adds an agent to the world agent collection
 * @param agent
 */
World.prototype.addWorldAgent = function(agent) { this.worldAgents.push(agent); };

/**
 * Adds an agent to the wave agent collection
  * @param agent
 */
World.prototype.addWaveAgent = function(agent) { this.waveAgents.push(agent); };

/**
 * Sets the current agent collection, and adds agents to a map
 * @param currentAgents
 */
World.prototype.setCurrentAgents = function(currentAgents) {
    this.currentAgents = currentAgents;
    for (var i = 0; i < this.currentAgents.length; i++) {
        var agent = this.currentAgents[i];
        this.currentAgentsMap[[agent.x, agent.y]] = agent;
        this.addAgentToContentMap(agent);
    }
};
World.prototype.getAgentByID = function(agentID) { return this.currentAgentsMap[agentID]; };

/**
 * Add expired agent
 */
World.prototype.addExpiredAgent = function(agent, time) {
    agent.alive = false;
    agent.diedAt = time;
    this.expiredAgents.push(agent);
};


/**
 * Add saved agent
 */
World.prototype.addSavedAgent = function(agent, time) {
    agent.alive = false;
    agent.diedAt = time;
    this.savedAgents.push(agent);

    // Adjust resources
    var resourceBonus = (this.currentWaveNumber < 5 ? 4 : (this.currentWaveNumber < 10 ? 3 : (this.currentWaveNumber < 20 ? 2 : 1)));
    this.currentResourceStore += resourceBonus;
};


/**
 *
 * @param culture
 * @param number
 */
World.prototype.generateAgents = function(culture, number) {
//    var agents = this.currentAgents;
    var agents = [];
    if (this.randomiseAgents) {
        // Get pathway length
        var pl = this.pathway.length;
        for (var i = 0; i < number; i ++) {
            // Generate a random tile position
            var tp = Math.floor(Math.random() * pl);
            var tile = this.pathway[tp];
            var agent = this.generateAgentAtPoint(culture, tile[0], tile[1]);
            agents.push(agent);
        }
    }
    else if (this.placeAgentsOnAllCells) {
        // Get pathway length
        for (var i = 0, pl = this.pathway.length; i < pl; i ++) {
            // Generate a random tile position
            var tile = this.pathway[i];
            var agent = this.generateAgentAtPoint(culture, tile[0], tile[1]);
            agents.push(agent);
//            agents.push(new SimpleAgent(culture, tile[0], tile[1]));
        }
    }
    else {
        for (var j = 0; j < this.entryPoints.length; j++) {
            var point = this.entryPoints[j];
            var x = point[0];
            var y = point[1];
            for (var i = 0; i < number; i ++) {
                var agent = this.generateAgentAtPoint(culture, x, y, j);
                agents.push(agent);
            }
        }
    }
    /*
    $.merge(agents, this.generateWaveAgents(number));
    $.merge(agents, this.worldAgents);
    */

    this.setCurrentAgents(agents);
	return agents;
};

/**
 * Generate agents at a point
 * @param numAgents
 */
World.prototype.generateAgentAtPoint = function(culture, x, y, j) {
    var agent = new Agent(culture, x, y);
    var colorSeed = j % 3;
    var colorScheme = (colorSeed == 0 ? "000" : (colorSeed == 1 ? "0f0" : "00f"));
    // TODO: Make this option configurable
//            agent.setColor(colorScheme);
    agent.delay = parseInt(Math.random() * AgentConstants.DEFAULT_SPEED * 5);
    agent.canCommunicateWithOtherAgents = (Universe.settings.agentsCanCommunicate);
    agent.bornAt = (Lifecycle.worldCounter);

    // Reduce health of a random category
    /**
     * TODO: Replace with more systematic approach - belongs in Agent type or custom world config
     */
    if (Universe.settings.agentsHaveRandomInitialHealth) {
        var categoryLength = Universe.resourceCategories.length;
        var categoryToReduceIndex = Math.floor(Math.random() * categoryLength);
        var categoryToReduce = Universe.resourceCategories[categoryToReduceIndex];

        // Reduce by no more than 50%
        var maxReduction = -50;
        var amountToReduce = Math.ceil(Math.random() * maxReduction);
        agent.adjustHealthForResourceCategory(amountToReduce, categoryToReduce);
    }
    return agent;
}

/**
 *
 * @param numAgents
 */
World.prototype.generateWaveAgents = function(numAgents) {
    var newAgents = [];
    for (var j = 0; j < numAgents; j++) {
        for (var i = 0; i < this.waveAgents.length; i++) {
            var waveAgent = this.waveAgents[i];
            newAgents.push(new Agent(waveAgent.culture, waveAgent.x, waveAgent.y));
        }
    }
    return newAgents;
};

/**
 * Indicates total number of agents saveable on this world
 */
World.prototype.getTotalSaveableAgents = function () {
    var firstWave = this.initialAgentNumber;
    var lastWave = this.waveNumber + this.initialAgentNumber -1;
    var minor = (firstWave * (firstWave - 1)) / 2;
    var major = (lastWave * (lastWave + 1)) / 2;
    var saveablePerEntryPoint = major - minor;
    var totalSaveable = saveablePerEntryPoint * this.entryPoints.length;
    return totalSaveable;
};

/**
 * Find the current resource index
 */
World.prototype.isPositionOccupiedByAgent = function (x, y) {
    for (var i = 0; i < this.currentAgents.length; i++) {
        var agent = this.currentAgents[i];
        if (agent.x == x && agent.y == y)
            return true;
    }
    return false;
};

/**
 * Find the current resource index
 */
World.prototype.countAgentsAtPosition = function (x, y) {
    var count = 0;
    for (var i = 0; i < this.currentAgents.length; i++) {
        var agent = this.currentAgents[i];
        if (agent.x == x && agent.y == y)
            count++;
    }
    return count;
};

// Overall agent health functions

/**
 * Find the current resource index
 */
World.prototype.currentAgentHealthStats = function () {
	var stats = {};
    for (var i = 0, l = Universe.resourceCategories.length; i < l; i++) {
		stats[Universe.resourceCategories[i].code] = 0;
	}
	stats.total = 0;
    for (var i = 0, l = this.currentAgents.length; i < l; i++) {
        var agent = this.currentAgents[i];
		for (var j in agent.culture.healthCategories) {
            var h = agent.getHealthForResourceCategory(agent.culture.healthCategories[j]);
			stats[agent.culture.healthCategories[j].code] += h;
		}
		stats.total += agent.health;
    }
    // Average values
    for (var i = 0, l = Universe.resourceCategories.length; i < l; i++) {
        stats[Universe.resourceCategories[i].code] /= this.currentAgents.length;
    }
    stats.total += this.currentAgents.length;
    return stats;
};


/******************************************/
/** RESOURCE FUNCTIONS ********************/
/******************************************/

/**
 *
 */
World.prototype.getResources = function() { return this.resources; };
/**
 * 
 * @param resources
 */
World.prototype.resetResources = function() {
    this.currentResourceStore = this.initialResourceStore;
    this.currentResourceSpent = 0;

    this.resources = [];
    this.worldResources = this.worldResources || [];
    this.removeAllResourcesFromContentMap();

    for (var i = 0; i < this.worldResources.length; i++) {
        this.resources.push(this.worldResources[i]);
        this.addResourceToContentMap(this.worldResources[i]);
    }
    this.resourceCategoryCounts = this.resetResourceCategoryCounts();
};

/**
 *
 * @param resources
 */
World.prototype.setResources = function(resources) {
    this.resources = resources;
    this.resourceCategoryCounts = this.resetResourceCategoryCounts();
};

/**
 *
 * @param resources
 */
World.prototype.setWorldResources = function(worldResources) {
    this.worldResources = worldResources;
    this.resourceCategoryCounts = this.resetResourceCategoryCounts();
};

/**
 *
 * @param agentType
 * @param number
 */
World.prototype.generateWorldResources = function() {
    var agents = [];
    if (this.randomiseResources && this.initialResourceNumber > 0) {
        // Get pathway length
        var a = [];
//        this.tiles.map(function(tile){(tile != null ? a.push(tile) : null)})
        this.tiles.map(function(tile){(a.push(tile))})
        var al = a.length;
        this.worldResources = [];
        for (var i = 0; i < this.initialResourceNumber; i ++) {
            // Generate a random tile position
            var x = Math.floor(Math.random() * this.cellsAcross);
            var y = Math.floor(Math.random() * this.cellsDown);
			/*
			var catLen = Universe.resourceCategories.length;
			var randomCat = Universe.resourceCategories[Math.floor(Math.random() * catLen)];
			var typeLen = randomCat.types.length;
			var rt = randomCat[Math.floor(Math.random() * typeLen)	];
			*/
            var rt = Universe.resourceTypes[Math.floor(Math.random() * Universe.resourceTypes.length)];
            this.worldResources.push(new Resource(rt, x, y));
        }
    }
    this.resetResources();
};


/**
 *
 * @param resource
 */
World.prototype.addResource = function(resource) {
    this.resources.push(resource);
    this.addResourceToContentMap(resource);
    this.incrementResourceCategoryCount(resource);

    var resourceCategory = resource.category.code;
    this.currentResourceStore -= resource.cost;
    this.currentResourceSpent += resource.cost;
//    this.currentWorldResourcesSpentByCategory[resourceCategory] += 1;
};

/**
 * 
 * @param resource
 */
World.prototype.removeResource = function(resource) {
    var index = this.getCurrentResourceIndex(resource);
    if (index > -1) {
        this.resources.splice(index, 1);
        this.removeResourceFromContentMap(resource);
        this.decrementResourceCategoryCount(resource);
    }
};


/**
 *
 * @param resource
 */
World.prototype.removeResourceByPosition = function(x, y) {
    var index = this.getResourceIndexAtPosition(x, y);
    if (index > -1) {
        var resource = this.resources[index];
        this.resources.splice(index, 1);
        this.removeResourceFromContentMap(resource);
        this.decrementResourceCategoryCount(resource);
    }
};

/**
 * 
 */
World.prototype.resetResourceCategoryCounts = function() {
    var rcc = {};
    Universe.resourceCategories.forEach(function(resourceCategory) {
        rcc[resourceCategory.code] = 0;
    });
    this.resources.forEach(function(resource) {
        rcc[resource.category.code] += 1;
    });
    return rcc;
};
/**
 *
 * @param resource
 */
World.prototype.incrementResourceCategoryCount = function(resource) {
    this.resourceCategoryCounts[resource.category.code] += 1;
};
/**
 * Decrements the resource category count
 * @param resource
 */
World.prototype.decrementResourceCategoryCount = function(resource) {
    this.resourceCategoryCounts[resource.category.code] -= 1;
};
/**
 * Gets the recource category count collection
 */
World.prototype.getResourceCategoryCounts = function() {
    return this.resourceCategoryCounts;
};
/**
 * Counts the resources of a given resource category
 * @param code
 */
World.prototype.getResourceCategoryCount = function(code) {
    return this.resourceCategoryCounts[code];
};
/**
 * Gets the proportion of resources with the given resource category code
 * @param code
 */
World.prototype.getResourceCategoryProportion = function(code) {
    return this.getResourceCategoryCount(code) / this.resources.length;
};

/**
 * Find the current resource index
 */
World.prototype.getCurrentResourceIndex = function (resource) {
    for (var i = 0; i < this.resources.length; i++) {
        var tmp = this.resources[i];
        if (tmp == resource) {
            return i;
        }
    }
    return -1;
};

/**
 * Find the current resource index
 */
World.prototype.isPositionOccupiedByResource = function (x, y) {
    for (var i = 0; i < this.resources.length; i++) {
        var resource = this.resources[i];
        if (resource.x == x && resource.y == y)
            return true;
    }
    return false;
};

/**
 * Find the current resource at a position
 */
World.prototype.getResourceIndexAtPosition = function (x, y) {
    for (var i = 0; i < this.resources.length; i++) {
        var resource = this.resources[i];
        if (resource.x == x && resource.y == y)
            return i;
    }
    return -1;
};


/**
 * Calculates the proportion of a particular resource type, relative to the overall number of resources, then returns a log derivative (so minor variations have minimal impact).
 * If the global variable FiercePlanet.ignoreResourceBalance is true, this calculation is ignored.
 * If the global variable FiercePlanet.resourcesInTension is true, this calculation is further adjusted by the proximity of other resources.
 *
 * @param   The resource to calculate the effect for
 * @param   Whether the resource mix should be ignored (TODO: should be moved to the Universe object)
 * @param   Whether tensions between resource categories should be factored in (TODO: should be moved to the Universe object)
 */
World.prototype.calculateResourceEffect = function (resource, ignoreResourceMix, resourcesInTension) {
    // Allow this calculation to be ignored
    if (ignoreResourceMix || Universe.settings.ignoreResourceBalance || Universe.settings.applyGeneralHealth || this.resources.length <= 1)
        return 1;

    var code = resource.category.code;
    var totalResources = this.resources.length;
    var resourceCategoryCount = this.getResourceCategoryCount(code);
    var resourceTypeProportion = (resourceCategoryCount / totalResources) * totalResources;
    var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
    var effect = proportionOfIdeal * proportionOfIdeal;


    // Further adjustment based on surrounding resources
    if (resourcesInTension || Universe.settings.resourcesInTension) {
        effect *= this.calculateSurroundingResourcesEffects(resource);
    }
    return effect;
};

/**
 * Calculates the effect of surrounding resources
 * TODO: Allow for a variety of effects
 *
 * @param   A resource to calculate the effect for
 * @returns   The effect to apply
 */
World.prototype.calculateSurroundingResourcesEffects = function (resource) {
    var x = resource.x;
    var y = resource.y;
    var resourceCategory = resource.category;
    var baseEffect = 1;
    for (var i = 0, l = this.resources.length; i < l; i++) {
        var neighbour = this.resources[i];
        var nx = neighbour.x;
        var ny = neighbour.y;
        if (nx == x && ny == y)
            continue;
//            if (Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
        // Added global resource tension setting
        if (Universe.settings.resourcesInTensionGlobally || Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
            var neighbourCategory = neighbour.category;
            baseEffect *= resourceCategory.doEvaluateOtherCategoryImpact(neighbourCategory);
        }
    }
    return baseEffect;
};

/**
 * Resets all resource yields to their original values
 */
World.prototype.resetResourceYields = function () {
    this.resources.forEach(function(resource) {
        resource.totalYield = resource.initialTotalYield;
    });
};


/**
 * Recover resources to a maximum of their initial state
 *
 * @returns An array of recovered resources
 */
World.prototype.recoverResources = function () {
    var recoveredResources = [];
    this.resources.forEach(function(resource) {
        if (resource.totalYield < resource.initialTotalYield) {
            /* Overly generous... */
            resource.incrementTotalYield();
            recoveredResources.push(resource);
        }
    });
    return recoveredResources;
};


/**
 * Initialise waves
 */
World.prototype.initialiseWaves = function(waveNumber) {
	if (_.isUndefined(this.waves) || this.waves.length == 0) {
		this.waves = [];
		for (var i = 0; i < waveNumber; i++) {
            var wave = new Wave();
            wave.agents = [];
            var cultures = this.cultures || ModuleManager.currentModule.allCultures();
            for (var j = 0, len = cultures.length; j < len; j++) {
                var culture = cultures[j];
                if (culture.generateEachWave && this.generateWaveAgentsAutomatically) {
                    var thisWaveNumber = (culture.waveNumber ? culture.waveNumber : Lifecycle.currentWorld.initialAgentNumber);
                    if (this.distributeAgentsNormally) {
                        var s = this.distributeAgentsSigma;
                        if (s == undefined)
                            s = 0;
                        thisWaveNumber = jStat.normal.sample(thisWaveNumber, s);
                    }
                    if (this.incrementAgentsEachWave)
                        thisWaveNumber += (this.incrementAgentsEachWave * i);
                    var agents = this.generateAgents(culture, thisWaveNumber);
                    wave.agents = agents;
//                    agents.forEach(function(a) {wave.agents.push(a);})
                }
            }
            this.waves.push(wave);
		}
	}
}




/******************************************/
/** LEVEL DIMENSION FUNCTIONS *************/
/******************************************/


/**
 * Find the critical path to the nearest exit point
 */
World.prototype.pointDistance = function(x, y, ex, ey) {
    return Math.abs(ex - x) + Math.abs(ey - y);
};


World.prototype.meanDistance = function (cell, goal){
    var x = cell[0], y = cell[1];
    var gx = goal[0], gy = goal[1];
    return Math.abs(gx - x) + Math.abs(gy - y);
};
World.prototype.isSameCell = function (c1, c2){
    return (c1 && c2 && c1[0] == c2[0] && c1[1] == c2[1])
};
World.prototype.isCell = function (cell){
    var x = cell[0], y = cell[1];
    return (this.getCell(x, y) == undefined);
};
World.prototype.isInHistory = function (cell, history){
    for (var i = 0, l = history.length; i < l; i++) {
        var testCell = history[i]
        if (this.isSameCell(cell, testCell))
            return true;
    }
    return false;
};
World.prototype.getDirections = function (cell, goal){
    var x = cell[0], y = cell[1];
    var gx = goal[0], gy = goal[1];
    var dx = gx - x, dy = gy - y;
    var directions = [];
    if (Math.abs(dx) < Math.abs(dy)) {
        if (dx < 0)
            directions = (dy < 0) ? [2, 3, 1, 0] : [2, 1, 3, 0];
        else
            directions = (dy < 0) ? [0, 3, 1, 2] : [0, 1, 3, 2];
    }
    else {
        if (dy < 0)
            directions = (dx < 0) ? [3, 2, 0, 1] : [3, 0, 2, 1];
        else
            directions = (dx < 0) ? [1, 2, 0, 3] : [1, 0, 2, 3];
    }
    return directions;
};

/**
 * Gets positions surrounding a given co-ordinate.
 * The von Neumann neighbourhood returns only positions to the left, right, top and bottom of the current position.
 * TODO: Fix for
 *
 * @param x
 * @param y
 * @param includeSelf
 */
World.prototype.getVonNeumannNeighbourhood = function(x, y, includeSelf) {
    var surroundingPositions = [];

    if (includeSelf)
        surroundingPositions.push({x: x, y: y});

    var extendRight = (x < this.cellsAcross - 1),
        extendDown = (y < this.cellsDown - 1),
        extendLeft = (x > 0),
        extendUp = (y > 0),
        nextX = extendRight ? x + 1 : 0,
        nextY = extendDown ? y + 1 : 0,
        prevX = extendLeft ? x - 1 : this.cellsAcross - 1,
        prevY = extendUp ? y - 1 : this.cellsDown - 1;

    if (this.allowOffscreenCycling || (nextX > 0))
        surroundingPositions.push({x: nextX, y: y});
    if (this.allowOffscreenCycling || (nextY > 0))
        surroundingPositions.push({x: x, y: nextY});
    if (this.allowOffscreenCycling || (prevX < this.cellsAcross - 1))
        surroundingPositions.push({x: prevX, y: y});
    if (this.allowOffscreenCycling || (prevY < this.cellsDown - 1))
        surroundingPositions.push({x: x, y: prevY});

    return surroundingPositions;
};

/**
 * Gets positions surrounding a given co-ordinate.
 * THe Moore neighbourhood returns only positions to the left, right, top and bottom of the current position.
 *
 * @param x
 * @param y
 * @param includeSelf
 */
World.prototype.getMooreNeighbourhood = function(x, y, includeSelf) {
    var surroundingPositions = [];

    if (includeSelf)
        surroundingPositions.push({x: x, y: y});

    var extendRight = (x < this.cellsAcross - 1),
        extendDown = (y < this.cellsDown - 1),
        extendLeft = (x > 0),
        extendUp = (y > 0),
        nextX = extendRight ? x + 1 : 0,
        nextY = extendDown ? y + 1 : 0,
        prevX = extendLeft ? x - 1 : this.cellsAcross - 1,
        prevY = extendUp ? y - 1 : this.cellsDown - 1;

    if (this.allowOffscreenCycling || (nextX > 0))
        surroundingPositions.push({x: nextX, y: y});
    if (this.allowOffscreenCycling || (nextX > 0 && nextY > 0))
        surroundingPositions.push({x: nextX, y: nextY});
    if (this.allowOffscreenCycling || (nextY > 0))
        surroundingPositions.push({x: x, y: nextY});
    if (this.allowOffscreenCycling || (prevX < this.cellsAcross - 1 && nextY > 0))
        surroundingPositions.push({x: prevX, y: nextY});
    if (this.allowOffscreenCycling || (prevX < this.cellsAcross - 1))
        surroundingPositions.push({x: prevX, y: y});
    if (this.allowOffscreenCycling || (prevX < this.cellsAcross - 1 && prevY < this.cellsDown - 1))
        surroundingPositions.push({x: prevX, y: prevY});
    if (this.allowOffscreenCycling || (prevY < this.cellsDown - 1))
        surroundingPositions.push({x: x, y: prevY});
    if (this.allowOffscreenCycling || (nextX > 0 && prevY < this.cellsDown - 1))
        surroundingPositions.push({x: nextX, y: prevY});

    return surroundingPositions;
};

/**
 */
World.prototype.getNeighbouringResources = function(x, y) {
    var surroundingPositions = this.getMooreNeighbourhood(x, y, true);
    var resources = [];
    for (var i = 0, l = surroundingPositions.length; i < l; i++) {
        var position = surroundingPositions[i];
        var cellResources = this.getResourcesAtContentMap(position.x, position.y);
        if (cellResources) {
            cellResources.forEach(function(resource){
                resources.push(resource);
            })
        }
    }
    return resources;
};

/**
 */
World.prototype.getNeighbouringAgents = function(x, y) {
    var surroundingPositions = this.getVonNeumannNeighbourhood(x, y, true);
    var agents = [];
    for (var i = 0, l = surroundingPositions.length; i < l; i++) {
        var position = surroundingPositions[i];
        var cellAgents = this.getAgentsAtContentMap(position.x, position.y);
        if (cellAgents) {
            cellAgents.forEach(function(agent){
                agents.push(agent);
            })
        }
    }
    return agents;
};


if (typeof exports !== "undefined")
    exports.World = World;
