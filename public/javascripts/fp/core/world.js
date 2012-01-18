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
        this.initialiseCells();
        this.generatePath();
        this.waves = undefined;
        this.resetResources();
        if (this.catastrophe != undefined)
            this.catastrophe.struck = false;

        // Set up world
        if (this.setup)
            this.setup();

        this.initialiseWaves(this.waveNumber);
    };

    // Sets the id, if passed in; otherwise default to 1001
    this.id = 1;
    this.name = undefined;

    // Dimensions
    this.cellsAcross = 10, this.cellsDown = 10;
    this.cells = [];

	// Game parameters
    this.isPresetWorld = false, this.isTerminalWorld = false, this.customWorld = false;
    this.entryPoints = [], this.exitPoints = [];

    // Agent parameters
    this.initialAgentNumber = 1, this.waveNumber = 1, this.expiryLimit = 1, this.waves = [];

	// Resource parameters
    this.initialResourceStore = 100, this.currentResourceStore = 100, this.initialResourceNumber = 0, this.currentResourceSpent = 0;

	// Cell options
    this.allowOffscreenCycling = false, this.resourcesOwnTilesExclusively = false, this.allowResourcesOnPath = false;
    // Rendering options
    this.isometric = false;
    // Agent options
    this.noWander = false, this.noSpeedChange = false;
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
    this.expiredAgents = [], this.savedAgents = [];

    // Resource variables
    this.worldResources = [], this.resources = [], this.resourceCategoryCounts = [];

    // User interface elements
    this.tip = null, this.catastrophe = null;
    this.introduction = "Welcome to world " + this.id + ".";
    this.conclusion = "Congratulations! You have completed world " + this.id + ".";

    // Google map, image and sound options
    this.backgroundTerrain = null, this.mapOptions = null, this.mapURL = null;
    this.thumbnail = undefined, this.image = null, this.imageAttribution = null, this.soundSrc = null;
}


// Tile functions
/**
 * Gets a tile at the given co-ordinate
 * @param x
 * @param y
 */
World.prototype.areAgentsAllowed = function(x, y) {
    return this.getCell(x, y).agentsAllowed;
};
/**
 * 
 * @param cellPositions
 */
World.prototype.allowAgentsOnCellPositions = function(cellPositions) {
    var world = this;
    var liveCellPositions = _.compact(cellPositions);
    liveCellPositions.forEach(function(cellPosition) {
        var cell = world.getCell(cellPosition.x, cellPosition.y);
        if (!_.isUndefined(cell)) {
            cell.agentsAllowed = false;
        }
    })
    this.generatePath();
};
World.prototype.forbidAgentOnCell = function(x, y) {
    var cell = this.getCell(x, y);
    if (!_.isUndefined(cell)) {
        cell.agentsAllowed = false;
        cell.isEntryPoint = false;
        cell.isExitPoint = false;
    }
};

World.prototype.forbidAgentsOnAllCells = function() {
    this.cells.forEach(function(cell) { cell.agentsAllowed = false;})
    this.generatePath();
};

World.prototype.allowAgentsOnAllCells = function() {
    this.cells.forEach(function(cell) { cell.agentsAllowed = true;})
    this.generatePath();
};
World.prototype.allowAgentsOnCellRange = function(start, number) {
    for (var i = start; i < start + number; i++) {
        var cell = this.cells[i];
        cell.agentsAllowed = true;
    }
    this.generatePath();
};
World.prototype.forbidAgentsOnCellRange = function(start, number) {
    for (var i = start; i < start + number; i++) {
        var cell = this.cells[i];
        cell.agentsAllowed = false;
    }
    this.generatePath();
};

/**
 * Generates a computed path based on the absence of tiles
 */
World.prototype.generatePath = function() {
    var pathCells = [];
    // New
    this.cells.forEach(function(cell) {
        if (cell.agentsAllowed) {
            pathCells.push([cell.x, cell.y]);
        }
    })
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
 * Remove cell from path
 */
World.prototype.removeFromPath = function(x, y) {
    if (this.getCell(x, y).agentsAllowed)
        this.pathway.splice(index, 1);
};
/**
 * Adds a particular terrain to all parts of the path
 */
World.prototype.addTerrainToPath = function(terrain) {
    this.cells.forEach(function(cell) {
        if (cell.agentsAllowed) {
            cell.terrain = terrain;
        }
    })
};
/**
 * Adds a particular terrain to the background
 */
World.prototype.addTerrainToBackground = function(terrain) {
    this.backgroundTerrain = terrain;
};


// Object functions
World.prototype.indexify = function(x, y) {
    return y * this.cellsAcross + x;
};
World.prototype.getCell = function(x, y) {
    return this.cells[this.indexify(x, y)];
};
World.prototype.initialiseCells = function() {
    for (var i = 0; i < this.cellsAcross; i++) {
        for (var j = 0; j < this.cellsDown; j++) {
            this.cells[this.indexify(i, j)] = new Cell(i, j);
        }
    }
    this.updateCells();
};
World.prototype.addCellAtPoint = function(x, y) {
    this.cells[this.indexify(x, y)] = new Cell(x, y);
}
World.prototype.updateCells = function() {
    for (var i = 0; i < this.resources.length; i++) {
        var resource = this.resources[i];
        var x = resource.x, y = resource.y;
        var cell = this.cells[this.indexify(x, y)];
        if (!_.isUndefined(cell))
            cell.resources.push(resource);
    }
    for (var i = 0; i < this.currentAgents.length; i++) {
        var agent = this.currentAgents[i];
        var x = agent.x, y = agent.y;
        var cell = this.cells[this.indexify(x, y)];
        if (!_.isUndefined(cell))
            cell.agents.push(agent);
    }
};
World.prototype.addResourceToCell = function(resource) {
    var x = resource.x, y = resource.y;
    var cell = this.cells[this.indexify(x, y)];
    if (!_.isUndefined(cell))
        cell.resources.push(resource);
};
World.prototype.removeResourceFromCell = function(resource) {
    var x = resource.x, y = resource.y;
    var cell = this.getCell(x, y);
    var index = _.indexOf(cell.resources, resource);
    if (!_.isUndefined(cell))
        cell.resources.splice(index, 1);
};
World.prototype.removeAllResourcesFromCells = function() {
    this.cells.forEach(function(cell) { cell.resources = []});
};
World.prototype.getResourcesAtCell = function(x, y) {
    return this.cells[this.indexify(x, y)].resources;
};
World.prototype.addAgentToCell = function(agent) {
    var x = agent.x, y = agent.y;
    var cell = this.cells[this.indexify(x, y)];
    if (!_.isUndefined(cell))
        cell.agents.push(agent);
};
World.prototype.removeAgentFromCell = function(agent) {
    var x = agent.x, y = agent.y;
    var cell = this.getCell(x, y);
    var index = _.indexOf(cell.agents, agent);
    if (!_.isUndefined(cell))
        cell.agents.splice(index, 1);
};
World.prototype.changeAgentInCell = function(agent, lastX, lastY) {
    var x = agent.x, y = agent.y;
    if (!_.isUndefined(lastX) && !_.isUndefined(lastY)) {
        var cell = this.getCell(lastX, lastY);
        var index = _.indexOf(cell.agents, agent);
        if (!_.isUndefined(cell))
            cell.agents.splice(index, 1);
    }

    this.addAgentToCell(agent);
};
World.prototype.removeAllAgentsFromCells = function() {
    this.cells.forEach(function(cell) { cell.agents = []});
};
World.prototype.getAgentsAtCell = function(x, y) {
    return this.cells[this.indexify(x, y)].agents;
};


// Entry point functions
/**
 *
 * @param x
 * @param y
 */
World.prototype.addEntryPoint = function(x, y) {
    var cell = this.getCell(x, y);
    if (!_.isUndefined(cell))
        cell.isEntryPoint = true;
};
World.prototype.getEntryPoints = function() {
    var entryPoints = [];
    this.cells.forEach(function(cell) {
        if (cell.isEntryPoint)
            entryPoints.push(cell);
    });
    return entryPoints;
};
/**
 * Resets the entry point collection, leaving only one entry point at co-ordinate (0. 0)
 */
World.prototype.resetEntryPoints = function() {
    this.cells.forEach(function(cell) {
        cell.isEntryPoint = false;
    });
};
/**
 * Removes an entry point at the given co-ordinate
 * @param x
 * @param y
 */
World.prototype.removeEntryPoint = function(x, y) {
    this.getCell(x, y).isEntryPoint = false;
};

// Exit point functions
/**
 *
 * @param x
 * @param y
 */
World.prototype.isExitPoint = function(x, y) {
    return this.getCell(x, y).isExitPoint;
};
/**
 *
 * @param x
 * @param y
 */
World.prototype.addExitPoint = function(x, y) {
    var cell = this.getCell(x, y);
    if (!_.isUndefined(cell))
        cell.isExitPoint = true;
};
/**
 *
 */
World.prototype.resetExitPoints = function() {
    this.cells.forEach(function(cell) {
        cell.isExitPoint = false;
    });
};
/**
 *
 * @param x
 * @param y
 */
World.prototype.removeExitPoint = function(x, y) {
    this.getCell(x, y).isExitPoint = false;
};
World.prototype.getExitPoints = function() {
    var exitPoints = [];
    this.cells.forEach(function(cell) {
        if (cell.isExitPoint)
            exitPoints.push(cell);
    });
    return exitPoints;
};

/**
 * Determines whether a cell at a given co-ordinate is either an entry or an exit point
 * @param x
 * @param y
 */
World.prototype.isEntryOrExitPoint = function(x, y) {
    var cell = this.getCell(x, y);
    if (!_.isUndefined(cell))
        return (cell.isEntryPoint || cell.isExitPoint);
    return false;
};


// Agent functions

/**
 * Retrieves current agents - will filter if a filter agent is available (requires Underscore to be loaded)
 */
World.prototype.getCurrentAgents = function() {
    if (typeof(_) === 'undefined' || _.isUndefined(this.currentAgentsFunction))
        return this.currentAgents;
    else
        return _.filter(this.currentAgents, this.currentAgentsFunction);
};

/**
 * Sets the current agent collection, and adds agents to a map
 * @param currentAgents
 */
World.prototype.setCurrentAgents = function(currentAgents) {
    this.currentAgents = currentAgents;
    for (var i = 0; i < this.currentAgents.length; i++) {
        var agent = this.currentAgents[i];
        this.currentAgentsMap[[agent.x, agent.y]] = agent;
        this.addAgentToCell(agent);
    }
};

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
        var entryPoints = this.getEntryPoints();
        for (var j = 0; j < entryPoints.length; j++) {
            var point = entryPoints[j];
            var x = point.x;
            var y = point.y;
            for (var i = 0; i < number; i ++) {
                var agent = this.generateAgentAtPoint(culture, x, y, j);
                agents.push(agent);
            }
        }
    }

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
 * Indicates total number of agents saveable on this world
 */
World.prototype.getTotalSaveableAgents = function () {
    var firstWave = this.initialAgentNumber;
    var lastWave = this.waveNumber + this.initialAgentNumber -1;
    var minor = (firstWave * (firstWave - 1)) / 2;
    var major = (lastWave * (lastWave + 1)) / 2;
    var saveablePerEntryPoint = major - minor;
    var totalSaveable = saveablePerEntryPoint * this.getEntryPoints().length;
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
    this.removeAllResourcesFromCells();

    for (var i = 0; i < this.worldResources.length; i++) {
        this.resources.push(this.worldResources[i]);
        this.addResourceToCell(this.worldResources[i]);
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
    this.addResourceToCell(resource);
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
        this.removeResourceFromCell(resource);
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
        this.removeResourceFromCell(resource);
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
        var cellResources = this.getResourcesAtCell(position.x, position.y);
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
        var cellAgents = this.getAgentsAtCell(position.x, position.y);
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
