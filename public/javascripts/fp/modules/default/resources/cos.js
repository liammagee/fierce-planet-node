/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the ResourceTypes namespace
 */
var CoS = CoS || {};
CoS.id = 'CoS';

// Resource categories
CoS.ECO_CATEGORY = new ResourceCategory("Economy", "eco", "#44ABE0");
CoS.ENV_CATEGORY = new ResourceCategory("Ecology", "enl", "#CBDB2A");
CoS.POL_CATEGORY = new ResourceCategory("Political", "pol", "#DE1F2A");
CoS.CUL_CATEGORY = new ResourceCategory("Cultural", "cul", "#2ADBCB");

/**
 * Do setup of this resource set
 */
CoS.doSetup = function() {

    CoS.ECONOMIC_RESOURCE_TYPES = [ResourceTypes.FARM_RESOURCE_TYPE, ResourceTypes.SHOP_RESOURCE_TYPE, ResourceTypes.BANK_RESOURCE_TYPE, ResourceTypes.FACTORY_RESOURCE_TYPE, ResourceTypes.STOCKMARKET_RESOURCE_TYPE];
    CoS.ECOLOGICAL_RESOURCE_TYPES = [ResourceTypes.FRESH_WATER_RESOURCE_TYPE, ResourceTypes.WILDLIFE_PARK_RESOURCE_TYPE, ResourceTypes.CLEAN_AIR_RESOURCE_TYPE, ResourceTypes.GREEN_ENERGY_RESOURCE_TYPE, ResourceTypes.BIODIVERSITY_RESOURCE_TYPE];
    CoS.POLITICAL_RESOURCE_TYPES = [ResourceTypes.LEGAL_SYSTEM_RESOURCE_TYPE, ResourceTypes.DEMOCRACY_RESOURCE_TYPE];
    CoS.CULTURAL_RESOURCE_TYPES = [ResourceTypes.CLINIC_RESOURCE_TYPE, ResourceTypes.SCHOOL_RESOURCE_TYPE, ResourceTypes.FESTIVAL_RESOURCE_TYPE];

        // Clear types
        CoS.ECO_CATEGORY.clearTypes();
        CoS.ENV_CATEGORY.clearTypes();
        CoS.POL_CATEGORY.clearTypes();
        CoS.CUL_CATEGORY.clearTypes();

// Economic resources
    CoS.ECO_CATEGORY.addType(ResourceTypes.FARM_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(ResourceTypes.SHOP_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(ResourceTypes.BANK_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(ResourceTypes.FACTORY_RESOURCE_TYPE);
    CoS.ECO_CATEGORY.addType(ResourceTypes.STOCKMARKET_RESOURCE_TYPE);


// Environmental resources
    CoS.ENV_CATEGORY.addType(ResourceTypes.FRESH_WATER_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(ResourceTypes.WILDLIFE_PARK_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(ResourceTypes.CLEAN_AIR_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(ResourceTypes.GREEN_ENERGY_RESOURCE_TYPE);
    CoS.ENV_CATEGORY.addType(ResourceTypes.BIODIVERSITY_RESOURCE_TYPE);

// Political resources
    CoS.POL_CATEGORY.addType(ResourceTypes.LEGAL_SYSTEM_RESOURCE_TYPE);
    CoS.POL_CATEGORY.addType(ResourceTypes.DEMOCRACY_RESOURCE_TYPE);


// Cultural resources
    CoS.CUL_CATEGORY.addType(ResourceTypes.CLINIC_RESOURCE_TYPE);
    CoS.CUL_CATEGORY.addType(ResourceTypes.SCHOOL_RESOURCE_TYPE);
    CoS.CUL_CATEGORY.addType(ResourceTypes.FESTIVAL_RESOURCE_TYPE);

	CoS.categories = [CoS.ECO_CATEGORY, CoS.ENV_CATEGORY, CoS.POL_CATEGORY, CoS.CUL_CATEGORY];
	CoS.types = CoS.ECONOMIC_RESOURCE_TYPES.concat(CoS.ECOLOGICAL_RESOURCE_TYPES.concat(CoS.POLITICAL_RESOURCE_TYPES.concat(CoS.CULTURAL_RESOURCE_TYPES)));
};


if (typeof exports !== "undefined")
    exports.CoS = CoS;
