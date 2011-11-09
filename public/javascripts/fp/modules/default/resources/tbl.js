/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the FiercePlanet namespace
 */
FiercePlanet.DefaultModule.TBL = FiercePlanet.DefaultModule.TBL || {};

// Resource categories
FiercePlanet.DefaultModule.TBL.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "44ABE0");
FiercePlanet.DefaultModule.TBL.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "ABBB2A");
FiercePlanet.DefaultModule.TBL.SOC_CATEGORY = new ResourceCategory("Social", "soc", "DE1F2A");
FiercePlanet.DefaultModule.TBL.ECO_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
    var neighbourCategoryCode = otherCategory.code;
    var baseEffect = 1.0;
    if (neighbourCategoryCode == "eco") {
        baseEffect *= 1.0;
    }
    else if (neighbourCategoryCode == "env") {
        baseEffect *= 1.2;
    }
    else if (neighbourCategoryCode == "soc") {
        baseEffect *= 0.8;
    }
    return baseEffect;
});
FiercePlanet.DefaultModule.TBL.ENV_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
    var neighbourCategoryCode = otherCategory.code;
    var baseEffect = 1.0;
    if (neighbourCategoryCode == "eco") {
        baseEffect *= 0.25;
    }
    else if (neighbourCategoryCode == "env") {
        baseEffect *= 1.2;
    }
    else if (neighbourCategoryCode == "soc") {
        baseEffect *= 1.0;
    }
    return baseEffect;
});
FiercePlanet.DefaultModule.TBL.SOC_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
    var neighbourCategoryCode = otherCategory.code;
    var baseEffect = 1.0;
    if (neighbourCategoryCode == "eco") {
        baseEffect *= 0.5;
    }
    else if (neighbourCategoryCode == "env") {
        baseEffect *= 1.1;
    }
    else if (neighbourCategoryCode == "soc") {
        baseEffect *= 1.2;
    }
    return baseEffect;
});


/**
 * Do setup of this resource set
 */
FiercePlanet.DefaultModule.TBL.doSetup = function() {

    // Arrays of resource kinds
    FiercePlanet.DefaultModule.TBL.ECONOMIC_RESOURCE_TYPES = [FiercePlanet.FARM_RESOURCE_TYPE, FiercePlanet.SHOP_RESOURCE_TYPE, FiercePlanet.BANK_RESOURCE_TYPE, FiercePlanet.FACTORY_RESOURCE_TYPE, FiercePlanet.STOCKMARKET_RESOURCE_TYPE];
    FiercePlanet.DefaultModule.TBL.ENVIRONMENTAL_RESOURCE_TYPES = [FiercePlanet.FRESH_WATER_RESOURCE_TYPE, FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE, FiercePlanet.CLEAN_AIR_RESOURCE_TYPE, FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE, FiercePlanet.BIODIVERSITY_RESOURCE_TYPE];
    FiercePlanet.DefaultModule.TBL.SOCIAL_RESOURCE_TYPES = [FiercePlanet.CLINIC_RESOURCE_TYPE, FiercePlanet.SCHOOL_RESOURCE_TYPE, FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE, FiercePlanet.DEMOCRACY_RESOURCE_TYPE, FiercePlanet.FESTIVAL_RESOURCE_TYPE];

    // Clear types
    FiercePlanet.DefaultModule.TBL.ECO_CATEGORY.clearTypes();
    FiercePlanet.DefaultModule.TBL.ENV_CATEGORY.clearTypes();
    FiercePlanet.DefaultModule.TBL.SOC_CATEGORY.clearTypes();

// Economic resources
    FiercePlanet.DefaultModule.TBL.ECO_CATEGORY.addType(FiercePlanet.FARM_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ECO_CATEGORY.addType(FiercePlanet.SHOP_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ECO_CATEGORY.addType(FiercePlanet.BANK_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ECO_CATEGORY.addType(FiercePlanet.FACTORY_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ECO_CATEGORY.addType(FiercePlanet.STOCKMARKET_RESOURCE_TYPE);


// Environmental resources
    FiercePlanet.DefaultModule.TBL.ENV_CATEGORY.addType(FiercePlanet.FRESH_WATER_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ENV_CATEGORY.addType(FiercePlanet.WILDLIFE_PARK_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ENV_CATEGORY.addType(FiercePlanet.CLEAN_AIR_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ENV_CATEGORY.addType(FiercePlanet.GREEN_ENERGY_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.ENV_CATEGORY.addType(FiercePlanet.BIODIVERSITY_RESOURCE_TYPE);


// Social resources
    FiercePlanet.DefaultModule.TBL.SOC_CATEGORY.addType(FiercePlanet.CLINIC_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.SOC_CATEGORY.addType(FiercePlanet.SCHOOL_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.SOC_CATEGORY.addType(FiercePlanet.LEGAL_SYSTEM_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.SOC_CATEGORY.addType(FiercePlanet.DEMOCRACY_RESOURCE_TYPE);
    FiercePlanet.DefaultModule.TBL.SOC_CATEGORY.addType(FiercePlanet.FESTIVAL_RESOURCE_TYPE);

};
