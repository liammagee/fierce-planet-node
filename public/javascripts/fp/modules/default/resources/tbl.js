/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the ResourceTypes namespace
 */
var TBL = TBL || {};
TBL.id = 'TBL';

// Resource categories
TBL.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "44ABE0");
TBL.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "ABBB2A");
TBL.SOC_CATEGORY = new ResourceCategory("Social", "soc", "DE1F2A");
TBL.ECO_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
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
TBL.ENV_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
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
TBL.SOC_CATEGORY.setEvaluateOtherCategoryImpact(function(otherCategory) {
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
TBL.doSetup = function() {

    // Arrays of resource kinds
    TBL.ECONOMIC_RESOURCE_TYPES = [ResourceTypes.FARM_RESOURCE_TYPE, ResourceTypes.SHOP_RESOURCE_TYPE, ResourceTypes.BANK_RESOURCE_TYPE, ResourceTypes.FACTORY_RESOURCE_TYPE, ResourceTypes.STOCKMARKET_RESOURCE_TYPE];
    TBL.ENVIRONMENTAL_RESOURCE_TYPES = [ResourceTypes.FRESH_WATER_RESOURCE_TYPE, ResourceTypes.WILDLIFE_PARK_RESOURCE_TYPE, ResourceTypes.CLEAN_AIR_RESOURCE_TYPE, ResourceTypes.GREEN_ENERGY_RESOURCE_TYPE, ResourceTypes.BIODIVERSITY_RESOURCE_TYPE];
    TBL.SOCIAL_RESOURCE_TYPES = [ResourceTypes.CLINIC_RESOURCE_TYPE, ResourceTypes.SCHOOL_RESOURCE_TYPE, ResourceTypes.LEGAL_SYSTEM_RESOURCE_TYPE, ResourceTypes.DEMOCRACY_RESOURCE_TYPE, ResourceTypes.FESTIVAL_RESOURCE_TYPE];

    // Clear types
    TBL.ECO_CATEGORY.clearTypes();
    TBL.ENV_CATEGORY.clearTypes();
    TBL.SOC_CATEGORY.clearTypes();

// Economic resources
    TBL.ECO_CATEGORY.addType(ResourceTypes.FARM_RESOURCE_TYPE);
    TBL.ECO_CATEGORY.addType(ResourceTypes.SHOP_RESOURCE_TYPE);
    TBL.ECO_CATEGORY.addType(ResourceTypes.BANK_RESOURCE_TYPE);
    TBL.ECO_CATEGORY.addType(ResourceTypes.FACTORY_RESOURCE_TYPE);
    TBL.ECO_CATEGORY.addType(ResourceTypes.STOCKMARKET_RESOURCE_TYPE);


// Environmental resources
    TBL.ENV_CATEGORY.addType(ResourceTypes.FRESH_WATER_RESOURCE_TYPE);
    TBL.ENV_CATEGORY.addType(ResourceTypes.WILDLIFE_PARK_RESOURCE_TYPE);
    TBL.ENV_CATEGORY.addType(ResourceTypes.CLEAN_AIR_RESOURCE_TYPE);
    TBL.ENV_CATEGORY.addType(ResourceTypes.GREEN_ENERGY_RESOURCE_TYPE);
    TBL.ENV_CATEGORY.addType(ResourceTypes.BIODIVERSITY_RESOURCE_TYPE);


// Social resources
    TBL.SOC_CATEGORY.addType(ResourceTypes.CLINIC_RESOURCE_TYPE);
    TBL.SOC_CATEGORY.addType(ResourceTypes.SCHOOL_RESOURCE_TYPE);
    TBL.SOC_CATEGORY.addType(ResourceTypes.LEGAL_SYSTEM_RESOURCE_TYPE);
    TBL.SOC_CATEGORY.addType(ResourceTypes.DEMOCRACY_RESOURCE_TYPE);
    TBL.SOC_CATEGORY.addType(ResourceTypes.FESTIVAL_RESOURCE_TYPE);

	TBL.categories = [TBL.ECO_CATEGORY, TBL.ENV_CATEGORY, TBL.SOC_CATEGORY];
	TBL.types = TBL.ECONOMIC_RESOURCE_TYPES.concat(TBL.ENVIRONMENTAL_RESOURCE_TYPES.concat(TBL.SOCIAL_RESOURCE_TYPES));
};


if (typeof(exports) != "undefined") 
    exports.TBL = TBL;