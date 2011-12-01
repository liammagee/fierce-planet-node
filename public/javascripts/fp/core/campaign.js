/*!
 * Fierce Planet - Campaign
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Campaign class definition
 *
 * @constructor
 */
function Campaign() {
}

/**
 * Gets a tile at the given co-ordinate
 */
Campaign.prototype = {
	levels: [],
	id: undefined,
	name: undefined,
	position: undefined
};


if (typeof(exports) != "undefined")
    exports.Campaign = Campaign;
