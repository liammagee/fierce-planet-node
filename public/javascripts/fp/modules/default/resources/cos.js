/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the FiercePlanet namespace
 */
var FiercePlanet = FiercePlanet || {};
FiercePlanet.DefaultModule.CoS = FiercePlanet.DefaultModule.CoS || {};

// Resource categories
FiercePlanet.DefaultModule.CoS.ECO_CATEGORY = new ResourceCategory("Economy", "eco", "44ABE0");
FiercePlanet.DefaultModule.CoS.ENV_CATEGORY = new ResourceCategory("Ecology", "enl", "CBDB2A");
FiercePlanet.DefaultModule.CoS.POL_CATEGORY = new ResourceCategory("Political", "pol", "DE1F2A");
FiercePlanet.DefaultModule.CoS.CUL_CATEGORY = new ResourceCategory("Cultural", "cul", "2ADBCB");

/**
 * Do setup of this resource set
 */
FiercePlanet.DefaultModule.CoS.doSetup = function() {

    FiercePlanet.DefaultModule.CoS.ECONOMIC_RESOURCE_TYPES = [FiercePlanet.FARM_RESOURCE_TYPE, FiercePlanet.SHOP_RESOURCE_TYPE, FiercePlanet.BANK_RESOURCE_TYPE, FiercePlanet.FACTORY_RESOURCE_TYPE, FiercePlanet.STOCKMARKET_RESOURCE_TYPE];
    FiercePlanet.DefaultModule.CoS.ECOLOGICAL_RESOURCE_TYPES = [FiercePlanet.FRESH_WATER_RESOURCE_TYPE, FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE, FiercePlanet.CLEAN_AIR_RESOURCE_TYPE, FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE, FiercePlanet.BIODIVERSITY_RESOURCE_TYPE];
    FiercePlanet.DefaultModule.CoS.POLITICAL_RESOURCE_TYPES = [FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE, FiercePlanet.DEMOCRACY_RESOURCE_TYPE];
    FiercePlanet.DefaultModule.CoS.CULTURAL_RESOURCE_TYPES = [FiercePlanet.CLINIC_RESOURCE_TYPE, FiercePlanet.SCHOOL_RESOURCE_TYPE, FiercePlanet.FESTIVAL_RESOURCE_TYPE];

        // Clear types
        FiercePlanet.DefaultModule.CoS.ECO_CATEGORY.clearTypes();
        FiercePlanet.DefaultModule.CoS.ENV_CATEGORY.clearTypes();
        FiercePlanet.DefaultModule.CoS.POL_CATEGORY.clearTypes();
        FiercePlanet.DefaultModule.CoS.CUL_CATEGORY.clearTypes();

// Economic resources
    FiercePlanet.DefaultModule.CoS.ECO_CATEGORY.addType(FiercePlanet.FARM_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ECO_CATEGORY.addType(FiercePlanet.SHOP_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ECO_CATEGORY.addType(FiercePlanet.BANK_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ECO_CATEGORY.addType(FiercePlanet.FACTORY_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ECO_CATEGORY.addType(FiercePlanet.STOCKMARKET_RESOURCE_TYPE);


// Environmental resources
    FiercePlanet.DefaultModule.CoS.ENV_CATEGORY.addType(FiercePlanet.FRESH_WATER_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ENV_CATEGORY.addType(FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ENV_CATEGORY.addType(FiercePlanet.CLEAN_AIR_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ENV_CATEGORY.addType(FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.ENV_CATEGORY.addType(FiercePlanet.BIODIVERSITY_RESOURCE_TYPE);

// Political resources
    FiercePlanet.DefaultModule.CoS.POL_CATEGORY.addType(FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.POL_CATEGORY.addType(FiercePlanet.DEMOCRACY_RESOURCE_TYPE);


// Cultural resources
    FiercePlanet.DefaultModule.CoS.CUL_CATEGORY.addType(FiercePlanet.CLINIC_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.CUL_CATEGORY.addType(FiercePlanet.SCHOOL_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.CoS.CUL_CATEGORY.addType(FiercePlanet.FESTIVAL_RESOURCE_TYPE);


};
