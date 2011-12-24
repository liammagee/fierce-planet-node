/*!
 * Fierce Planet - Statistics
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Statistics Singleton class definition
 */
var Statistics = {};

(function() {
	this.populationStats = function() {
		var data = [];
		if (Lifecycle.levelCounter > 0) {
            var cultures = ModuleManager.currentModule.allCultures();
            var j = 0;
            for (var i = 0, l = this.cultures.length; i < l; i++) {
                var as = cultures[i];
                var counter = 0;
                Lifecycle.currentLevel.currentAgents.forEach(function(a) {if (a.culture.name == as.name) counter++} )
                var agentData = [as.name, counter];
                j++;
                data.push(agentData);
            }
        }
		return data;
	};
	
	this.healthStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
            var stats = Lifecycle.currentLevel.currentAgentHealthStats();
            for (var i = 0, l = World.resourceCategories.length; i < l; i++) {
				data.push(World.resourceCategories[i].code, stats[World.resourceCategories[i].code]);
			}
			data.push('total', stats.total);

        }
		return data;
	};
	
	this.savedAndExpiredStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
			var saved =  Lifecycle.currentLevel.savedAgents.length;
			var expired =  Lifecycle.currentLevel.expiredAgents.length;
            data.push(['Saved', saved]);
            data.push(['Expired', expired]);
            data.push(['Save rate', saved / (expired == 0 ? 1 : expired)]);
        }
		return data;
	};

    /**
     * Firstly, calculates life expectancy based on average age of expired agents.
     * Secondly, recalibrates for saved and live agents, where those agents exceed the life
     * expectancy of expired agents.
     */
	this.lifeExpectancyStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
            // Set up variables
            var expiredCount = 0, expiredTotal = 0, expiredMin = 0, expiredMax = 0, expiredAve = 0;
            var recalibratedCount = 0, recalibratedTotal = 0, recalibratedMin = 0, recalibratedMax = 0, recalibratedAve = 0;
			var liveCounter = 0, liveMin = 0, liveMax = 0;
			var savedCounter = 0, savedMin = 0, savedMax = 0;
			var live =  Lifecycle.currentLevel.currentAgents.length;
			var saved =  Lifecycle.currentLevel.savedAgents.length;
			var expired =  Lifecycle.currentLevel.expiredAgents.length;
			var total = saved + expired, totalMin = 0, totalMax = 0;
			live = (live == 0 ? 1 : live)
			saved = (saved == 0 ? 1 : saved)
			expired = (expired == 0 ? 1 : expired)
            total = (total == 0 ? 1 : total)


            // Calculate life expectancy for expired agents
            var expiredCount = Lifecycle.currentLevel.expiredAgents.length;
            Lifecycle.currentLevel.expiredAgents.forEach(function(agent) {
                var age = (agent.diedAt - agent.bornAt);
                expiredTotal += age;
                if (expiredMin == 0 || age < expiredMin)
                    expiredMin = age;
                if (age > expiredMax)
                    expiredMax = age;
            });
            expiredAve = expiredTotal / expiredCount;

            // Now recalibrate for saved and live agents
            recalibratedCount = expiredCount;
            recalibratedTotal = expiredTotal;
            recalibratedMin = expiredMin;
            recalibratedMax = expiredMax;
            // Saved agents
            Lifecycle.currentLevel.savedAgents.forEach(function(agent) {
                var age = (agent.diedAt - agent.bornAt);
                if (age > expiredAve) {
                    recalibratedCount++;
                    recalibratedTotal += age;
                    if (age > recalibratedMax)
                        recalibratedMax = age;
                }
            });
            // Live agents
            Lifecycle.currentLevel.currentAgents.forEach(function(agent) {
                var age = (Lifecycle.levelCounter - agent.bornAt);
                if (age > expiredAve) {
                    recalibratedCount++;
                    recalibratedTotal += age;
                    if (age > recalibratedMax)
                        recalibratedMax = age;
                }
            });
            recalibratedAve = recalibratedTotal / recalibratedCount;
            data.push(['Expired count', Math.floor(expiredCount) ]);
            data.push(['Expired ave', Math.floor(expiredAve) ]);
            data.push(['Expired min', Math.floor(expiredMin) ]);
            data.push(['Expired max', Math.floor(expiredMax) ]);
            data.push(['Recalibrated count', Math.floor(recalibratedCount) ]);
            data.push(['Recalibrated ave', Math.floor(recalibratedAve) ]);
            data.push(['Recalibrated min', Math.floor(recalibratedMin) ]);
            data.push(['Recalibrated max', Math.floor(recalibratedMax) ]);
        }
		return data;
	};
	
	this.lifeExpectancyByAgentCultureStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
            for (var i = 0, l = World.cultures.length; i < l; i++) {
				var agentType = World.cultures[i];
				var expiredCounter = 0, expiredMin = 0, expiredMax = 0;
				var expired =  Lifecycle.currentLevel.expiredAgents.length;
				expired = (expired == 0 ? 1 : expired)
				for (var j in Lifecycle.currentLevel.expiredAgents) {
					var agent = Lifecycle.currentLevel.expiredAgents[j];
					if (agent.culture.name == agentType.name) {
						var age = (agent.diedAt - agent.bornAt);

						expiredCounter += age;
						if (j == 0) {
							expiredMin = age;
							expiredMax = age;
						}
						else {
							if (age < expiredMin)
								expiredMin = age;
							if (age > expiredMax)
								expiredMax = age;
						}
					}
				}
				var ele = expiredCounter / expired;
	            data.push([agentType.name + ' life expectancy', Math.floor(ele) ]);
	            data.push([agentType.name + ' min life', Math.floor(expiredMin) ]);
	            data.push([agentType.name + ' max life', Math.floor(expiredMax) ]);
			}
        }
		return data;
	};
	
	this.hdiStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
            var stats = Lifecycle.currentLevel.currentAgentHealthStats();
			data.push('total', stats.total);

        }
		return data;
	};
	
	/**
	 * TODO: Depends upon TBL resources
	 * Expressed as: Longevity * Happiness (say, economic + social stats) / Eco footprint
	 */
	this.hpiStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
            var stats = Lifecycle.currentLevel.currentAgentHealthStats();
            for (var i = 0, l = World.resourceCategories.length; i < l; i++) {
				data.push(World.resourceCategories[i].code, stats[World.resourceCategories[i].code]);
			}
			data.push('total', stats.total);

        }
		return data;
	};
	
}).apply(Statistics);

if (typeof(exports) !== "undefined")
	exports.Statistics = Statistics;
