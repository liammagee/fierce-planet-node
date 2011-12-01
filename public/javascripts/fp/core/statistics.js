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
            var agentSets = ModuleManager.currentModule.allCultures();
            var j = 0;
            for (var i in agentSets) {
                var as = agentSets[i];
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
			for (var i in World.resourceCategories) {
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
	
	this.lifeExpectancyStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
			var savedCounter = 0, savedMin = 0, savedMax = 0;
			var expiredCounter = 0, expiredMin = 0, expiredMax = 0;
			var saved =  Lifecycle.currentLevel.savedAgents.length;
			var expired =  Lifecycle.currentLevel.expiredAgents.length;
			var total = saved + expired, totalMin = 0, totalMax = 0;
			total = (total == 0 ? 1 : total)
			saved = (saved == 0 ? 1 : saved)
			expired = (expired == 0 ? 1 : expired)
			for (var i in Lifecycle.currentLevel.savedAgents) {
				var agent = Lifecycle.currentLevel.savedAgents[i];
				var age = (agent.diedAt - agent.bornAt);
				savedCounter += age;
				if (i == 0) {
					savedMin = age;
					savedMax = age;
				}
				else {
					if (age < savedMin)
						savedMin = age;
					if (age > savedMax)
						savedMax = age;
				}
			}
			for (var i in Lifecycle.currentLevel.expiredAgents) {
				var agent = Lifecycle.currentLevel.expiredAgents[i];
				var age = (agent.diedAt - agent.bornAt);
				expiredCounter += age;
				if (i == 0) {
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
			var sle = savedCounter / saved;
			var ele = expiredCounter / expired;
			var le = (savedCounter + expiredCounter) / total;
			totalMin = ((savedMin < expiredMin && savedMin > 0) ? savedMin : expiredMin);
			totalMax = (savedMax > expiredMax ? savedMax : expiredMax);
            data.push(['Saved ave', Math.floor(sle) ]);
            data.push(['Saved min', Math.floor(savedMin) ]);
            data.push(['Saved max', Math.floor(savedMax) ]);
            data.push(['Expired ave', Math.floor(ele) ]);
            data.push(['Expired min', Math.floor(expiredMin) ]);
            data.push(['Expired max', Math.floor(expiredMax) ]);
            data.push(['Total ave', Math.floor(le) ]);
            data.push(['Total min', Math.floor(totalMin) ]);
            data.push(['Total max', Math.floor(totalMax) ]);
        }
		return data;
	};
	
	this.lifeExpectancyByAgentCultureStats = function() {
		var data = [];
        if (Lifecycle.levelCounter > 0) {
			for (var i in World.cultures) {
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
			for (var i in World.resourceCategories) {
				data.push(World.resourceCategories[i].code, stats[World.resourceCategories[i].code]);
			}
			data.push('total', stats.total);

        }
		return data;
	};
	
}).apply(Statistics);

if (typeof(exports) !== "undefined")
	exports.Statistics = Statistics;
