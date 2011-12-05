/*!
 * Fierce Planet - Level
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Level class definition
 *
 * @constructor
 * @param id
 */
function Level(id) {
    // Sets the id, if passed in; otherwise default to 1001
    this.id = id || 1001;

    this.name;
    this.thumbnail;

    this.isPresetLevel = false;
    this.isTerminalLevel = false;
    this.waves = [];
    this.entryPoints = [];
    this.exitPoints = [];

    // Dimensions
    this.cellsAcross = 10;
    this.cellsDown = 10;

    // Parameters
    this.initialAgentNumber = 1;
    this.waveNumber = 10;
    this.expiryLimit = 20;

    this.initialResourceStore = 100;
    this.currentResourceStore = 100;
    this.currentResourceSpent = 0;
    this.initialResourceNumber = 0;

    this.allowOffscreenCycling = false;
    this.allowResourcesOnPath = false;
    this.customLevel = false;
    this.noWander = false;
    this.noSpeedChange = false;
	this.resourcesOwnTilesExclusively = false;

    // Rendering options
    this.isometric = false;

    // Generation options
    this.randomiseAgents = false;
    this.randomiseResources = false;
	this.generateWaveAgentsAutomatically = true;
	this.incrementAgentsEachWave = true;
	this.generateWaveAgentsAutomatically = true;
    this.distributeAgentsNormally = false;
    this.distributeAgentsSigma = 0;
    this.distributeAgentsHealthNormally = false;
    this.distributeAgentsHealthSigma = 0;


    // Current level state
    this.tiles = [];
    this.tileMap = [];

    // Agent variables
    this.levelAgents = [];
    this.waveAgents = [];
    this.currentAgents = [];
    this.currentAgentsMap = {};
    this.expiredAgents = [];
    this.savedAgents = [];

    // Resource variables
    this.levelResources = [];
    this.resources = [];
    this.resourceCategoryCounts = this.resetResourceCategoryCounts();

    /** Object for storing tiles, resources and other level entities for co-ordinate based look-up */
    this.cells = {};

    this.pathway = this.generatePath();
    this.terrainMap = {};

    // User interface elements
    this.tip = null;
    this.introduction = "Welcome to level " + this.id + ".";
    this.conclusion = "Congratulations! You have completed level " + this.id + ".";
    this.catastrophe = null;

    
    // Google map, image and sound options
    this.backgroundTerrain = null;
    this.mapOptions = null;
    this.mapURL = null;
    this.image = null;
    this.imageAttribution = null;
    this.soundSrc = null;

}


// Tile functions
/**
 * Gets a tile at the given co-ordinate
 * @param x
 * @param y
 */
Level.prototype.getTile = function(x, y) {
    var tilePosition = y * this.cellsAcross + x;
    return this.tiles[tilePosition];
};
/**
 * Gets tiles surrounding a given co-ordinate
 * @param x
 * @param y
 */
Level.prototype.getSurroundingTiles = function(x, y) {
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
Level.prototype.getTiles = function() { return this.tiles; };
/**
 * 
 * @param tiles
 */
Level.prototype.setTiles = function(tiles) {
    this.tiles = tiles;
    this.generatePath();
    this.assignCells();
};
/**
 *
 * @param tile
 */
Level.prototype.addTile = function(tile) {
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
Level.prototype.addDefaultTile = function(x, y) {
    this.addTile(new Tile(DEFAULT_TILE_COLOR, x, y));
};
/**
 * 
 * @param x
 * @param y
 */
Level.prototype.removeTile = function(x, y) {
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
Level.prototype.fillWithTiles = function() {
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
 * Remove all tiles from the level
 */
Level.prototype.removeAllTiles = function() {
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
Level.prototype.removeTiles = function(start, number) {
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
Level.prototype.addTiles = function(start, number) {
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
Level.prototype.generatePath = function() {
    var pathCells = [];
    for (var i = 0; i < this.cellsDown; i++) {
        for (var j = 0; j < this.cellsAcross; j++) {
            var tilePosition = i * this.cellsAcross + j;
            if (this.tiles[tilePosition] == undefined)
                pathCells.push([j, i]);
        }

    }
    this.pathway = pathCells;
    return pathCells;
};

/**
 * Retrieves the index of the co-ordinate in the path variable
 */
Level.prototype.isInPath = function(x, y) {
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
Level.prototype.addToPath = function(x, y) {
    if (this.isInPath(x, y) == -1)
        this.pathway.push([x, y]);
};
/**
 * Remove cell from path
 */
Level.prototype.removeFromPath = function(x, y) {
    var index = this.isInPath(x, y);
    if (index > -1)
        this.pathway.splice(index, 1);
};
/**
 * Adds a particular terrain to all parts of the path
 */
Level.prototype.addTerrainToPath = function(terrain) {
    this.terrainMap = {};
    for (var i in this.pathway) {
        var path = this.pathway[i];
        this.terrainMap[path] = terrain;
    }
};
/**
 * Adds a particular terrain to the background
 */
Level.prototype.addTerrainToBackground = function(terrain) {
    this.backgroundTerrain = terrain;
};


// Cell functions
/**
 *
 */
Level.prototype.getCells = function() { return this.cells; };
/**
 * 
 * @param x
 * @param y
 */
Level.prototype.getCell = function(x, y) { return this.cells[[x, y]]; };

/**
 *
 * @param cells
 */
Level.prototype.setCells = function(cells) { this.cells = cells; };
/**
 * 
 * @param x
 * @param y
 * @param value
 */
Level.prototype.addCell = function(x, y, value) {this.cells[[x, y]] = value;};
/**
 *
 * @param x
 * @param y
 */
Level.prototype.annulCell = function(x, y) { this.cells[[x, y]] = undefined; };
/**
 *
 */
Level.prototype.assignCells = function() {
    this.cells = [];
    for (var i = 0; i < this.tiles.length; i++) {
        var tile = this.tiles[i];
        if (tile != undefined)
            this.addCell(tile.x, tile.y, tile);
    }
};

// Entry point functions
/**
 *
 * @param x
 * @param y
 */
Level.prototype.addEntryPoint = function(x, y) {
    if (!this.isEntryOrExitPoint(x, y))
        this.entryPoints.push([x, y]);
};

/**
 * Resets the entry point collection, leaving only one entry point at co-ordinate (0. 0)
 */
Level.prototype.resetEntryPoints = function() {
    this.entryPoints = [];
    this.addEntryPoint(0, 0);
};
/**
 * Removes an entry point at the given co-ordinate
 * @param x
 * @param y
 */
Level.prototype.removeEntryPoint = function(x, y) {
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
Level.prototype.getFirstEntryPoint = function() { return this.entryPoints[0]; };

// Exit point functions
/**
 *
 * @param x
 * @param y
 */
Level.prototype.isExitPoint = function(x, y) {
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
Level.prototype.addExitPoint = function(x, y) {
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
Level.prototype.resetExitPoints = function() {
    this.exitPoints = [];
};
/**
 *
 * @param x
 * @param y
 */
Level.prototype.removeExitPoint = function(x, y) {
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
Level.prototype.isEntryOrExitPoint = function(x, y) {
    for (var i in this.entryPoints) {
        var point = this.entryPoints[i];
        if (point[0] == x && point[1]== y) {
            return true;
        }
    }
    for (var i in this.exitPoints) {
        var point = this.exitPoints[i];
        if (point[0] == x && point[1]== y) {
            return true;
        }
    }
    return false;
};


// Agent functions

/**
 * Adds an agent to the level agent collection
 * @param agent
 */
Level.prototype.addLevelAgent = function(agent) { this.levelAgents.push(agent); };

/**
 * Adds an agent to the wave agent collection
  * @param agent
 */
Level.prototype.addWaveAgent = function(agent) { this.waveAgents.push(agent); };

/**
 * Sets the current agent collection, and adds agents to a map
 * @param currentAgents
 */
Level.prototype.setCurrentAgents = function(currentAgents) {
    this.currentAgents = currentAgents;
    for (var i in this.currentAgents) {
        var agent = this.currentAgents[i];
        this.currentAgentsMap[agent.id] = agent;
    }
};
Level.prototype.getAgentByID = function(agentID) { return this.currentAgentsMap[agentID]; };

/**
 * Add agent
 */
Level.prototype.addAgent = function(agent) {
    this.currentAgents.push(agent);
    this.currentAgentsMap[agent.id] = agent;
};

/**
 * Add expired agent
 */
Level.prototype.addExpiredAgent = function(agent, time) {
    agent.alive = false;
    agent.diedAt = time;
    this.expiredAgents.push(agent);
};


/**
 * Add saved agent
 */
Level.prototype.addSavedAgent = function(agent, time) {
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
Level.prototype.generateAgents = function(culture, number) {
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
    $.merge(agents, this.levelAgents);
    */

    this.setCurrentAgents(agents);
	return agents;
};

/**
 * Generate agents at a point
 * @param numAgents
 */
Level.prototype.generateAgentAtPoint = function(culture, x, y, j) {
    var agent = new Agent(culture, x, y);
    var colorSeed = j % 3;
    var colorScheme = (colorSeed == 0 ? "000" : (colorSeed == 1 ? "0f0" : "00f"));
    // TODO: Make this option configurable
//            agent.setColor(colorScheme);
    agent.delay = parseInt(Math.random() * AgentConstants.DEFAULT_SPEED * 5);
    agent.canCommunicateWithOtherAgents = (World.settings.agentsCanCommunicate);
    agent.bornAt = (Lifecycle.levelCounter);

    // Reduce health of a random category
    /**
     * TODO: Replace with more systematic approach - belongs in Agent type or custom level config
     */
    if (World.settings.agentsHaveRandomInitialHealth) {
        var categoryLength = World.resourceCategories.length;
        var categoryToReduceIndex = Math.floor(Math.random() * categoryLength);
        var categoryToReduce = World.resourceCategories[categoryToReduceIndex];

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
Level.prototype.generateWaveAgents = function(numAgents) {
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
 * Indicates total number of agents saveable on this level
 */
Level.prototype.getTotalSaveableAgents = function () {
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
Level.prototype.isPositionOccupiedByAgent = function (x, y) {
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
Level.prototype.countAgentsAtPosition = function (x, y) {
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
Level.prototype.currentAgentHealthStats = function () {
	var stats = {};
	for (var i in World.resourceCategories) {
		stats[World.resourceCategories[i].code] = 0;
	}
	stats.total = 0;
    for (var i = 0; i < this.currentAgents.length; i++) {
        var agent = this.currentAgents[i];
		for (var j in agent.culture.healthCategories) {
            var h = agent.getHealthForResourceCategory(agent.culture.healthCategories[j]);
			stats[agent.culture.healthCategories[j].code] += h;
		}
		stats.total += agent.health;
    }
    // Average values
    for (var i in World.resourceCategories) {
        stats[World.resourceCategories[i].code] /= this.currentAgents.length;
    }
    stats.total += this.currentAgents.length;
    return stats;
};

// Resource functions
/**
 *
 */
Level.prototype.getResources = function() { return this.resources; };
/**
 * 
 * @param resources
 */
Level.prototype.resetResources = function() {
    this.currentResourceStore = this.initialResourceStore;
    this.currentResourceSpent = 0;

    this.resources = [];
    this.levelResources = this.levelResources || [];

    for (var i = 0; i < this.levelResources.length; i++) {
        this.resources.push(this.levelResources[i]);
    }
    this.resourceCategoryCounts = this.resetResourceCategoryCounts();
};

/**
 *
 * @param resources
 */
Level.prototype.setResources = function(resources) {
    this.resources = resources;
    this.resourceCategoryCounts = this.resetResourceCategoryCounts();
};

/**
 *
 * @param resources
 */
Level.prototype.setLevelResources = function(levelResources) {
    this.levelResources = levelResources;
    this.resourceCategoryCounts = this.resetResourceCategoryCounts();
};

/**
 *
 * @param agentType
 * @param number
 */
Level.prototype.generateLevelResources = function() {
    var agents = [];
    if (this.randomiseResources && this.initialResourceNumber > 0) {
        // Get pathway length
        var a = [];
//        this.tiles.map(function(tile){(tile != null ? a.push(tile) : null)})
        this.tiles.map(function(tile){(a.push(tile))})
        var al = a.length;
        this.levelResources = [];
        for (var i = 0; i < this.initialResourceNumber; i ++) {
            // Generate a random tile position
            var x = Math.floor(Math.random() * this.cellsAcross);
            var y = Math.floor(Math.random() * this.cellsDown);
			/*
			var catLen = World.resourceCategories.length;
			var randomCat = World.resourceCategories[Math.floor(Math.random() * catLen)];
			var typeLen = randomCat.types.length;
			var rt = randomCat[Math.floor(Math.random() * typeLen)	];
			*/
            var rt = World.resourceTypes[Math.floor(Math.random() * World.resourceTypes.length)];
            this.levelResources.push(new Resource(rt, x, y));
        }
    }
    this.resetResources();
};


/**
 *
 * @param resource
 */
Level.prototype.addResource = function(resource) {
    this.resources.push(resource);
    this.incrementResourceCategoryCount(resource);

    var resourceCategory = resource.category.code;
    this.currentResourceStore -= resource.cost;
    this.currentResourceSpent += resource.cost;
//    this.currentLevelResourcesSpentByCategory[resourceCategory] += 1;
};

/**
 * 
 * @param resource
 */
Level.prototype.removeResource = function(resource) {
    var index = this.getCurrentResourceIndex(resource);
    if (index > -1) {
        this.resources.splice(index, 1);
        this.decrementResourceCategoryCount(resource);
    }
};


/**
 *
 * @param resource
 */
Level.prototype.removeResourceByPosition = function(x, y) {
    var index = this.getResourceIndexAtPosition(x, y);
    if (index > -1) {
        var resource = this.resources[index];
        this.resources.splice(index, 1);
        this.decrementResourceCategoryCount(resource);
    }
};

/**
 * 
 */
Level.prototype.resetResourceCategoryCounts = function() {
    var rcc = {};
    World.resourceCategories.forEach(function(resourceCategory) {
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
Level.prototype.incrementResourceCategoryCount = function(resource) {
    this.resourceCategoryCounts[resource.category.code] += 1;
};
/**
 * Decrements the resource category count
 * @param resource
 */
Level.prototype.decrementResourceCategoryCount = function(resource) {
    this.resourceCategoryCounts[resource.category.code] -= 1;
};
/**
 * Gets the recource category count collection
 */
Level.prototype.getResourceCategoryCounts = function() {
    return this.resourceCategoryCounts;
};
/**
 * Counts the resources of a given resource category
 * @param code
 */
Level.prototype.getResourceCategoryCount = function(code) {
    return this.resourceCategoryCounts[code];
};
/**
 * Gets the proportion of resources with the given resource category code
 * @param code
 */
Level.prototype.getResourceCategoryProportion = function(code) {
    return this.getResourceCategoryCount(code) / this.resources.length;
};

/**
 * Find the current resource index
 */
Level.prototype.getCurrentResourceIndex = function (resource) {
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
Level.prototype.isPositionOccupiedByResource = function (x, y) {
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
Level.prototype.getResourceIndexAtPosition = function (x, y) {
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
 * @param   Whether the resource mix should be ignored (TODO: should be moved to the World object)
 * @param   Whether tensions between resource categories should be factored in (TODO: should be moved to the World object)
 */
Level.prototype.calculateResourceEffect = function (resource, ignoreResourceMix, resourcesInTension) {
        // Allow this calculation to be ignored
        if (ignoreResourceMix || World.settings.ignoreResourceBalance || World.settings.applyGeneralHealth || this.resources.length <= 1)
            return 1;

        var code = resource.category.code;
        var totalResources = this.resources.length;
        var resourceCategoryCount = this.getResourceCategoryCount(code);
        var resourceTypeProportion = (resourceCategoryCount / totalResources) * totalResources;
        var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
        var effect = proportionOfIdeal * proportionOfIdeal;

        // Further adjustment based on surrounding resources
        if (resourcesInTension || World.settings.resourcesInTension) {
            effect *= this.calculateSurroundingResourcesEffects(resource);
        }
        return effect;
    };

/**
 * Calculates the effect of surrounding resources
 *
 * @param   A resource to calculate the effect for
 * @returns   The effect to apply
 */
Level.prototype.calculateSurroundingResourcesEffects = function (resource) {
        var x = resource.x;
        var y = resource.y;
        var resourceCategory = resource.category;
        var baseEffect = 1;
        for (var i in this.resources) {
            var neighbour = this.resources[i];
            var nx = neighbour.x;
            var ny = neighbour.y;
            if (nx == x && ny == y)
                continue;
//            if (Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
            // Added global resource tension setting
            if (World.settings.resourcesInTensionGlobally || Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
                var neighbourCategory = neighbour.category;
                baseEffect *= resourceCategory.doEvaluateOtherCategoryImpact(neighbourCategory);
            }
        }
        return baseEffect;
    };

/**
 * Resets all resource yields to their original values
 */
Level.prototype.resetResourceYields = function () {
    this.resources.forEach(function(resource) {
        resource.totalYield = resource.initialTotalYield;
    });
};


/**
 * Recover resources to a maximum of their initial state
 *
 * @returns An array of recovered resources
 */
Level.prototype.recoverResources = function () {
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
 * Processes neighbouring resources
 *
 * TODO: Add tests
 */
Level.prototype.processNeighbouringResources = function(agent) {
    var x = agent.x;
    var y = agent.y;
    for (var j = 0; j < this.resources.length; j++) {
        var resource = this.resources[j];
        var rx = resource.x;
        var ry = resource.y;
        if (Math.abs(rx - x) <= 1 && Math.abs(ry - y) <= 1) {
            var resourceEffect = this.calculateResourceEffect(resource);
            resource.provideYield(agent, resourceEffect, !this.noSpeedChange);
        }
    }
};


/**
 * Processes neighbouring agents
 *
 * TODO: Add tests
 */
Level.prototype.processNeighbouringAgents = function(agent) {
    if (World.settings.godMode || !World.settings.predatorsVisible)
        return;

    var x = agent.x;
    var y = agent.y;
    agent.isHit = (false);
    var agents = this.currentAgents;
    for (var j = 0; j < agents.length; j++) {
        var a = agents[j];
        var ax = a.x;
        var ay = a.y;
        if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
            if (!World.settings.godMode && World.settings.predatorsVisible && agent.culture.isHitable && a.culture.canHit) {
                agent.isHit = true;
            }
        }
    }
    if (agent.isHit)
        agent.adjustGeneralHealth(-10);
};

/**
 * Initialise waves
 */
Level.prototype.initialiseWaves = function(waveNumber) {
	if (typeof(this.waves) === "undefined" || this.waves.length == 0) {
		this.waves = [];
		for (var i = 0; i < waveNumber; i++) {
            var wave = new Wave();
            wave.agents = [];
            var cultures = ModuleManager.currentModule.allCultures();
            for (var j in cultures) {
                var culture = cultures[j];
                if (culture.generateEachWave && this.generateWaveAgentsAutomatically) {
                    var thisWaveNumber = (culture.waveNumber ? culture.waveNumber : Lifecycle.currentLevel.initialAgentNumber);
                    if (this.distributeAgentsNormally) {
                        var s = this.distributeAgentsSigma;
                        if (s == undefined)
                            s = 0;
                        thisWaveNumber = jStat.normal.sample(thisWaveNumber, s);
                    }
                    if (this.incrementAgentsEachWave)
                        thisWaveNumber += (this.incrementAgentsEachWave * i);
                    var agents = this.generateAgents(culture, thisWaveNumber);
                    agents.forEach(function(a) {wave.agents.push(a);})
                }
            }
            this.waves.push(wave);
		}
	}
}



/**
 * Find the critical path to the nearest exit point
 */
Level.prototype.criticalPath = function(x, y, h) {
    var horizontal = h || true;

    var shortestDistance = -1, shortistTrail;
    for (var i in this.exitPoints) {
        var ep = this.exitPoints[i];
        var tx = ep[0], ty = ep[1];
        var result = FiercePlanet.Framework.MazeStrategies.criticalPathToExitPoint(x, y, tx, ty);
        var distance = result.length;
        if (shortestDistance == -1 ||  distance < shortestDistance) {
            shortestDistance = distance;
            shortistTrail = result;
        }
    }
    return { res: shortistTrail.length, trail: shortistTrail};
};


var MAX_DEPTH = 1000;
Level.prototype.criticalPathToExitPoint = function(sx, sy, ex, ey) {
    var cell = [sx, sy], goal = [ex, ey];
    var history = [];
    var trails = {};
    var depth = 0;
    history.push(cell);
    trails[sy * this.cellsAcross + sx] = [cell];
    var candidates = [];
    candidates.push(cell);
    while (depth++ < MAX_DEPTH) {
        var newCandidates = [];
        for (var i in candidates) {
            var candidate = candidates[i];
            var x = candidate[0], y = candidate[1];
            if (this.isSameCell(candidate, goal)) {
                return trails[y * this.cellsAcross + x];
            }
            var directions = this.getDirections(candidate, goal);
            for (var j = 0; j < directions.length; j++) {
                var nx = x, ny = y;
                switch(directions[j]) {
                    case 0:
                        nx++;
                        break;
                    case 1:
                        ny++;
                        break;
                    case 2:
                        nx--;
                        break;
                    case 3:
                        ny--;
                        break;
                }
                var newCell = [nx, ny];
                if (nx < 0 || nx >= this.cellsAcross || ny < 0 || ny >= this.cellsDown)
                    continue;
                if (!this.isCell(newCell))
                    continue;
                if (this.isInHistory(newCell, history))
                    continue;
                // Exclude cells occupied exclusively by resources
                if (World.settings.resourcesOwnTilesExclusively && this.isPositionOccupiedByResource(nx, ny))
                    continue;

                newCandidates.push(newCell);
                history.push(newCell)

                var candidateKey = y * this.cellsAcross + x;
                var candidateTrail = trails[candidateKey]
                var newCandidateKey = ny * this.cellsAcross + nx;
                var newCandidateTrail = []
                for (var k in candidateTrail) {
                    newCandidateTrail.push(candidateTrail[k]);
                }
                newCandidateTrail.push(newCell);
                trails[newCandidateKey] = newCandidateTrail;
            }
        }
        candidates = [];
        for (var i in newCandidates) {
            candidates.push(newCandidates[i]);
        }
    }

};

/**
 * Find the critical path to the nearest exit point
 */
Level.prototype.pointDistance = function(x, y, ex, ey) {
    return Math.abs(ex - x) + Math.abs(ey - y);
};


Level.prototype.meanDistance = function (cell, goal){
    var x = cell[0], y = cell[1];
    var gx = goal[0], gy = goal[1];
    return Math.abs(gx - x) + Math.abs(gy - y);
};
Level.prototype.isSameCell = function (c1, c2){
    return (c1 && c2 && c1[0] == c2[0] && c1[1] == c2[1])
};
Level.prototype.isCell = function (cell){
    var x = cell[0], y = cell[1];
    return (this.getCell(x, y) == undefined);
};
Level.prototype.isInHistory = function (cell, history){
    for (var i in history) {
        var testCell = history[i]
        if (this.isSameCell(cell, testCell))
            return true;
    }
    return false;
};
Level.prototype.getDirections = function (cell, goal){
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



if (typeof(exports) != "undefined")
    exports.Level = Level;
