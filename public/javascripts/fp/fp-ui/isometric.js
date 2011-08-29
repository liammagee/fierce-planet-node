/*!
 * Fierce Planet - Isometric utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains isometric utility functions
 */
FiercePlanet.Isometric = FiercePlanet.Isometric || {};
var Isometric = Isometric || {};


// Adapted from Danko Kozar, http://www.flashperfection.com/tutorials/Isometric-Transformations-15818.html

// "0.46365 (radians) - it's a “classic” 1:2 isometric angle which lays up perfectly into pixel grid of the computer screen. "
Isometric.DEFAULT_PERSPECTIVE_ANGLE = 0.46365;
//FiercePlanet.Orientation.perspectiveAngle = 0.30;
FiercePlanet.Orientation.perspectiveAngle = Isometric.DEFAULT_PERSPECTIVE_ANGLE;

Isometric.DEFAULT_ROTATION_ANGLE = 0;
FiercePlanet.Orientation.rotationAngle = Isometric.DEFAULT_ROTATION_ANGLE;


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.offsets3DPoint = function (point3d) {
    var x = point3d[0];
    var y = point3d[1];
    var z = point3d[2];

    // Cartesian coordinates
    var xCart = (x-z)*Math.cos(FiercePlanet.Orientation.perspectiveAngle);
    // flash coordinates
    var xI = xCart;
    // Cartesian coordinates
    var yCart = y+(x+z)*Math.sin(FiercePlanet.Orientation.perspectiveAngle);
    // flash coordinates
    var yI = -yCart;


    return {x: xI, y: yI};
};


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.generate2DPoint = function (origin, point3d) {
    var xOrigin = origin[0];
    var yOrigin = origin[1];
    var point = Isometric.offsets3DPoint(point3d);
    var xI = point.x + xOrigin;
    var yI = point.y + yOrigin;
    return {x: xI, y: yI};
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.lineTo3DPoint = function (context, origin, point3d) {
    var point = Isometric.generate2DPoint(origin, point3d);
    context.lineTo(point.x, point.y);
    return point;
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.draw3DTile = function (context, origin, tileSize) {
    var x3d = [tileSize, 0, 0];
    var y3d = [0, tileSize, 0];
    var z3d = [0, 0, tileSize];
    var xOrigin = origin[0];
    var yOrigin = origin[1];
    var point = Isometric.offsets3DPoint(x3d);

    // Revise height
    var isoTileHeight = - point.y * 2;
    y3d = [0, isoTileHeight, 0];

//    var originCoordX = xOrigin + point.x;
//    var originCoordY = yOrigin + isoTileHeight;
//    var endCoordX = xOrigin - point.x;
//    var endCoordY = yOrigin;

//    context.clearRect();

    context.beginPath();
    context.moveTo(xOrigin, yOrigin);
    Isometric.lineTo3DPoint(context, origin, x3d);
    Isometric.lineTo3DPoint(context, origin, y3d);
    Isometric.lineTo3DPoint(context, origin, z3d);
    context.lineTo(xOrigin, yOrigin);
    context.closePath();
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 */
Isometric.doIsometricOffset = function (xPos, yPos) {
    // Set up variables to describe the mid point
    var midTileX = (FiercePlanet.cellsAcross - 1) / 2;
    var midTileY = (FiercePlanet.cellsDown - 1) / 2;
    var midX = midTileX * FiercePlanet.Orientation.cellWidth;
    var midY = midTileY * FiercePlanet.Orientation.cellHeight;
	
	// Get ratio of width to height
	var r = midX / midY;

	// Cell dimensions
	var cw = FiercePlanet.Orientation.cellWidth;
	var ch = FiercePlanet.Orientation.cellHeight;
	// Skewed cell dimensions
    var tileOffset = Isometric.offsets3DPoint([ch, 0, 0]);
	var tx = tileOffset.x;
	var ty = tileOffset.y;
	// Generate skew
	var sx = tx * 2 / cw;
	var sy = ty * 2 / (ch * r);
	
	// Generate top left co-ords
	var x = xPos * cw;
	var y = yPos * ch;
	
	// Get offsets from midpoints
	var dx = x - midX;
	var dy = y - midY;
	
	// Normalised Difference in x, y co-ordinates
	var dxy = dx - (dy * r);
	// Half the difference, to generate a 1:2 isometric perspective
	var hdxy = dxy * 0.5;
	
	// 
	// Generate the x offset from the midpoint, based on the y difference plus half the xy difference
	var ox = dx - hdxy;
	// Generate the y offset from the midpoint, based on half the xy difference
	var oy = - hdxy;

	// Apply skews to offsets
	var sox = sx * ox;
	var soy = sy * oy;

	// Generate new x, y co-ordinates
	var nx = midX + sox;
	var ny = midY - soy;

    return {x: nx, y: ny};
};

/**
 * Normalises the isometric co-ordinate to a convention co-ordinate position
 * TODO: Needs proper mathematical reversal of all angular transformations
 */
Isometric.normaliseCoordinates = function (nx, ny) {
    var tileOffset = Isometric.offsets3DPoint([FiercePlanet.Orientation.cellHeight, 0, 0]);

    // Set up variables to describe the mid point
    var midTileX = (FiercePlanet.cellsAcross - 1) / 2;
    var midTileY = (FiercePlanet.cellsDown - 1) / 2;
    var midX = midTileX * FiercePlanet.Orientation.cellWidth;
    var midY = midTileY * FiercePlanet.Orientation.cellHeight;

	// Get ratio of width to height
	var r = midX / midY;

	// Cell dimensions
	var cw = FiercePlanet.Orientation.cellWidth;
	var ch = FiercePlanet.Orientation.cellHeight;
	// Skewed cell dimensions
    var tileOffset = Isometric.offsets3DPoint([ch, 0, 0]);
	var tx = tileOffset.x;
	var ty = tileOffset.y;
	// Generate skew
	var sx = tx * 2 / cw;
	var sy =  - ty * 2 / (ch * r);

	// Generate differences
	var dnx = nx - midX;
	var dny = ny - midY;
	
	// Reversing skews
	var snx = dnx / sx;
	var sny = dny / sy;

	// Generate differences
	var dnxy = snx - sny;
	// Generate offsets
	var nox = dnxy;
	var noy = (snx + sny) / r;
	// Original positions
	var nnx = midX + nox;
	var nny = midY + noy;	

    var newX = nnx;
    var newY = nny;

    //ORIGINAL
    /*
    var isoCellRatio = FiercePlanet.Orientation.cellWidth / (tileOffset.x * 2);
    var _diffX = (x - midTilePosX) * isoCellRatio;
    var _diffY = (y - midTilePosY);
    var newXPos = _diffX - (_diffY * midTilePosX / midTilePosY);
    var newYPos = (_diffX * midTilePosY / midTilePosX + _diffY);
    var _newX = midTilePosX + ((newXPos));
    var _newY = midTilePosY + ((newYPos));
    */

    // New version
	/*
    var xPos = x / (tileOffset.x * 2);
    var yPos = y / (tileOffset.y * -2);
    var diffX = xPos - midTileX;
    var diffY = yPos - midTileY;
    var diffXY = diffX - diffY;
    var halfDiffXY = diffXY * 2;
    var diffRelativeX = diffX - diffY - diffXY;
    var diffRelativeY = diffY - diffXY;
    var diffRelativeCellX = diffRelativeX;
    var diffRelativeCellY = diffRelativeY;

    var fullTileOffsetX = FiercePlanet.Orientation.cellWidth;
    var fullTileOffsetY = FiercePlanet.Orientation.cellHeight;

    var diffCoordX = diffRelativeCellX * fullTileOffsetX;
    var diffCoordY = diffRelativeCellY * fullTileOffsetY;
    var newX = midTilePosX + diffCoordX;
    var newY = midTilePosY + diffCoordY;
	*/

//    var newX = midTilePosX + ((newXPos));
//    var newY = midTilePosY + ((newYPos));

    /*
    Log.info(tileOffset.x+":" + tileOffset.y)
    Log.info(diffX+":" + diffY+":" + diffXY)
    Log.info(midTileX+":" + midTileY)
    Log.info(diffRelativeX+":" + diffRelativeY)
    Log.info(diffRelativeCellX+":" + diffRelativeCellY)
    Log.info(diffCoordX+":" + diffCoordY)
    Log.info(midTilePosX+":" + midTilePosY)
    Log.info(xPos+":" + yPos)
    */
    
    return {x: newX, y: newY};
};

/**
 * Normalises the isometric co-ordinate to a convention co-ordinate position
 */
Isometric.roundTo = function (value, number) {
    var isNeg = (value < 0);
    var baseValue = (isNeg ? Math.ceil(value) : Math.floor(value));
  var remainder = value % 1;
  if (!isNeg && remainder > number)
    value = baseValue + number;
  else if (isNeg && remainder < - number)
    value = baseValue - number;
  else
    value = baseValue;
  return value;
};


// Adapted from Danko Kozar, http://www.flashperfection.com/tutorials/Isometric-Transformations-15818.html


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.xFla = function (xOrigin, x, y, z) {
    var xCart = (x-z)*Math.cos(FiercePlanet.Orientation.perspectiveAngle);
    // flash coordinates
    var xI = xCart + xOrigin;
    return (xI);
};


/**
 * Transforms x,y,z coordinates into Flash y coordinate
 * @param x
 * @param y
 * @param z
 */
Isometric.yFla = function (yOrigin, x, y, z) {
    var yCart = y+(x+z)*Math.sin(FiercePlanet.Orientation.perspectiveAngle);
    // flash coordinates
    var yI = -yCart + yOrigin;
    return (yI);
};

// --- drawing functions --------------------------------
/**
 *
 * @param l
 * @param r
 * @param g
 * @param b
 * @param a
 */
Isometric.style = function (l, r, g, b, a) {
    // a: line width
    // b: line color
    // c: line alpha
    ctx.lineWidth = l;
    ctx.strokeStyle = rgb(r, g, b, a);
};
/**
 *
 * @param ctx
 * @param x
 * @param y
 * @param z
 */
Isometric.plot = function (ctx, xOrigin, yOrigin, x, y, z) {
    ctx.moveTo(Isometric.xFla(xOrigin, x, y, z), Isometric.yFla(yOrigin, x, y, z));
};
/**
 *
 * @param ctx
 * @param x
 * @param y
 * @param z
 */
Isometric.draw = function (ctx, xOrigin, yOrigin, x, y, z) {
    ctx.lineTo(Isometric.xFla(xOrigin, x, y, z), Isometric.yFla(yOrigin, x, y, z));
};

/**
 *
 * @param x
 * @param y
 * @param z
 * @param a
 * @param b
 * @param c
 * @param color
 */
Isometric.box = function (ctx, xOrigin, yOrigin, x, y, z, a, b, c) {
    ctx.beginPath();
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    ctx.closePath();
};
/**
 *
 * @param x
 * @param y
 * @param z
 * @param a
 * @param b
 * @param c
 * @param color
 * @param fill
 */
Isometric.boxFilled = function (ctx, xOrigin, yOrigin, x, y, z, a, b, c) {
//    style(1, color, 100);
    ctx.beginPath();
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    ctx.closePath();
};